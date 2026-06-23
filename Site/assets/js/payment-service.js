(function () {
  const paymentsKey = "usinalinkPayments";
  const ui = () => window.UsinaLinkUi;

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentSession() {
    try {
      return JSON.parse(sessionStorage.getItem("usinalinkSession") || localStorage.getItem("usinalinkSession") || "null") || {};
    } catch {
      return {};
    }
  }

  async function apiGet(path) {
    if (window.UsinaLinkApi) return window.UsinaLinkApi.get(path);
    const response = await fetch(`http://localhost:3001${path}`);
    if (!response.ok) throw new Error("API indisponivel");
    return response.json();
  }

  async function loadSourceData() {
    const mock = window.UsinaLinkMockPayments || { orders: [], proposals: [] };
    const cachedOrders = readJson("usinalinkOrdersCache", []);
    const cachedProposals = readJson("usinalinkProposalsCache", []);
    try {
      const [orders, proposals] = await Promise.all([apiGet("/api/pedidos"), apiGet("/api/propostas")]);
      writeJson("usinalinkOrdersCache", orders);
      writeJson("usinalinkProposalsCache", proposals);
      return { orders: orders.length ? orders : mock.orders, proposals: proposals.length ? proposals : mock.proposals, source: "api" };
    } catch {
      return {
        orders: cachedOrders.length ? cachedOrders : mock.orders,
        proposals: cachedProposals.length ? cachedProposals : mock.proposals,
        source: cachedOrders.length ? "localStorage" : "mock"
      };
    }
  }

  function enrichOrder(order, proposals, payments) {
    const proposal = proposals.find(item => item.pedidoId === order.id || item.solicitacaoId === order.id) || {};
    const payment = payments.find(item => item.orderId === order.id) || null;
    const totals = ui().calculateTotals(order, proposal, payment);
    const paymentStatus = payment?.status || (String(order.status || "").toLowerCase().includes("pag") ? "Pago" : "Aguardando pagamento");
    return {
      ...order,
      usina: proposal.usina || order.usina || "Usina a definir",
      usinaId: proposal.usinaId || order.usinaId || "",
      propostaId: proposal.id || "",
      valor: payment?.valorTotal || proposal.valor || order.valor || ui().formatCurrency(totals.total),
      frete: proposal.frete || order.frete || ui().formatCurrency(0),
      prazo: proposal.prazo || order.prazo || "A definir",
      endereco: order.endereco || "Endereco de entrega em validacao",
      formaPagamento: payment?.method || "Nao selecionada",
      statusPagamento: paymentStatus,
      statusPedido: payment?.orderStatus || order.status || "Pendente",
      pagamento: payment,
      totals
    };
  }

  async function getOrders() {
    const { orders, proposals, source } = await loadSourceData();
    const payments = readJson(paymentsKey, []);
    const session = currentSession();
    let filtered = orders;
    if (session.tipo === "empresa" && session.empresaId) filtered = orders.filter(order => !order.empresaId || order.empresaId === session.empresaId);
    if (session.tipo === "usina" && session.usinaId) filtered = orders.filter(order => proposals.some(proposal => proposal.usinaId === session.usinaId && (proposal.pedidoId === order.id || proposal.solicitacaoId === order.id)));
    return filtered.map(order => enrichOrder(order, proposals, payments)).sort((a, b) => new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0)).map(order => ({ ...order, source }));
  }

  async function getOrder(id) {
    const orders = await getOrders();
    return orders.find(order => order.id === id) || orders[0] || null;
  }

  function savePayment(order, method) {
    const payments = readJson(paymentsKey, []);
    const totals = order.totals || ui().calculateTotals(order);
    const payment = {
      id: `pay-${Date.now()}`,
      orderId: order.id,
      method,
      status: "Pago",
      orderStatus: "Em producao",
      valorTotal: ui().formatCurrency(totals.total),
      subtotal: ui().formatCurrency(totals.subtotal),
      desconto: ui().formatCurrency(totals.discount),
      impostos: ui().formatCurrency(totals.taxes),
      protocol: `USL-${Date.now()}`,
      createdAt: new Date().toISOString(),
      testMode: true
    };
    const next = payments.filter(item => item.orderId !== order.id);
    next.push(payment);
    writeJson(paymentsKey, next);
    return payment;
  }

  window.UsinaLinkPayments = { getOrders, getOrder, savePayment, currentSession, paymentsKey };
}());
