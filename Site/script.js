const toast = document.createElement("div");
toast.className = "toast";
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

const signupConfig = {
  empresa: {
    labels: ["Nome da empresa", "CNPJ", "E-mail corporativo", "Nome do responsavel", "Cargo", "Senha"],
    placeholders: ["Metal Forte Ltda.", "00.000.000/0001-00", "compras@empresa.com", "Nome e sobrenome", "Gerente de compras", "Crie uma senha"],
    icons: ["EMP", "#", "@", "N", "ID", "*"],
    types: ["text", "text", "email", "text", "text", "password"],
    button: "Cadastrar empresa",
    redirect: "dashboard-empresa.html",
    orange: false
  },
  pessoa: {
    labels: ["Nome completo", "CPF", "E-mail", "Telefone", "Senha"],
    placeholders: ["Nome e sobrenome", "000.000.000-00", "voce@email.com", "(00) 00000-0000", "Crie uma senha"],
    icons: ["N", "#", "@", "TEL", "*"],
    types: ["text", "text", "email", "tel", "password"],
    button: "Cadastrar pessoa fisica",
    redirect: "dashboard-empresa.html",
    orange: false
  },
  usina: {
    labels: ["Nome da usina", "CNPJ", "E-mail industrial", "Respons\u00e1vel t\u00e9cnico", "Especialidade principal", "Senha"],
    placeholders: ["Atlas Metais", "00.000.000/0001-00", "comercial@usina.com.br", "Nome do responsavel", "Usinagem de precisao", "Crie uma senha"],
    icons: ["USI", "#", "@", "N", "ESP", "*"],
    types: ["text", "text", "email", "text", "text", "password"],
    button: "Cadastrar usina",
    redirect: "dashboard-usina.html",
    orange: true
  }
};

function updateSignupForm(type) {
  const config = signupConfig[type];
  const form = document.querySelector(".signup-dynamic-form");
  const button = document.querySelector("#signup-submit");
  if (!config || !form || !button) return;

  for (let index = 0; index < 6; index += 1) {
    const label = document.querySelector(`#field-label-${index + 1}`);
    const input = document.querySelector(`#signup-field-${index + 1}`);
    const symbol = input?.closest(".input-wrap")?.querySelector(".input-symbol");
    const field = input?.closest(".field");
    const visible = index < config.labels.length;

    if (field) field.hidden = !visible;
    if (!visible) {
      if (input) input.required = false;
      continue;
    }

    label.textContent = config.labels[index];
    input.type = config.types[index];
    input.placeholder = config.placeholders[index];
    input.value = "";
    input.required = true;
    if (symbol) symbol.textContent = config.icons[index];
  }

  button.textContent = config.button;
  button.classList.toggle("btn-orange", config.orange);
  button.classList.toggle("btn-primary", !config.orange);
  form.dataset.redirect = config.redirect;
}

document.querySelectorAll(".choice-card").forEach((card) => {
  card.addEventListener("click", () => {
    const radio = card.querySelector('input[type="radio"]');
    if (!radio) return;
    document.querySelectorAll(".choice-card").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll('.choice-card input[type="radio"]').forEach((item) => {
      item.checked = false;
    });
    radio.checked = true;
    card.classList.add("active");
    updateSignupForm(radio.value);
  });
});

const checkedSignupType = document.querySelector('.choice-card input[type="radio"]:checked');
if (checkedSignupType) updateSignupForm(checkedSignupType.value);

const profileData = {
  empresa: {
    cancel: "dashboard-empresa.html",
    button: "btn-primary",
    sections: {
      gerais: {
        title: "Informa\u00e7\u00f5es gerais",
        subtitle: "Dados principais exibidos no perfil comercial da organiza\u00e7\u00e3o.",
        fields: [
          ["Raz\u00e3o Social", "text", "Metal Forte Componentes Industriais Ltda."],
          ["Nome Fantasia", "text", "Metal Forte"],
          ["Setor de Atua\u00e7\u00e3o", "select", "Ind\u00fastria metalmec\u00e2nica", ["Ind\u00fastria metalmec\u00e2nica", "Minera\u00e7\u00e3o", "Energia", "Automotivo"]],
          ["Porte da Empresa", "select", "M\u00e9dio porte", ["Pequeno porte", "M\u00e9dio porte", "Grande porte"]],
          ["Descri\u00e7\u00e3o / Apresenta\u00e7\u00e3o", "textarea", "Empresa especializada em aquisi\u00e7\u00e3o e manuten\u00e7\u00e3o de componentes industriais para linhas de produ\u00e7\u00e3o."]
        ]
      },
      contato: { title: "Contato", subtitle: "Canais comerciais e respons\u00e1veis por comunica\u00e7\u00e3o.", fields: [["E-mail comercial", "email", "comercial@metalforte.com"], ["Telefone", "tel", "(11) 3333-4400"], ["WhatsApp", "tel", "(11) 98888-4400"], ["Site", "url", "https://www.metalforte.com"], ["Respons\u00e1vel principal", "text", "Ana Martins"]] },
      endereco: { title: "Endere\u00e7o", subtitle: "Localiza\u00e7\u00e3o fiscal e operacional da organiza\u00e7\u00e3o.", fields: [["CEP", "text", "04000-000"], ["Rua", "text", "Avenida Industrial"], ["N\u00famero", "text", "1200"], ["Bairro", "text", "Distrito Empresarial"], ["Cidade", "text", "Sao Paulo"], ["Estado", "select", "SP", ["SP", "MG", "RJ", "PR", "SC", "RS"]], ["Complemento", "text", "Galpao 4"]] },
      documentos: { title: "Documentos", subtitle: "Registros e comprovantes usados na valida\u00e7\u00e3o comercial.", fields: [["CNPJ", "text", "12.345.678/0001-90"], ["Inscri\u00e7\u00e3o Estadual", "text", "123.456.789.110"], ["Contrato Social", "text", "Contrato_social_metalforte.pdf"], ["Alvar\u00e1", "text", "Alvara_2026.pdf"], ["Certifica\u00e7\u00f5es", "text", "ISO 9001, ISO 14001"]] },
      seguranca: { title: "Seguran\u00e7a", subtitle: "Proteja o acesso dos usu\u00e1rios vinculados \u00e0 organiza\u00e7\u00e3o.", fields: [["Senha atual", "password", ""], ["Nova senha", "password", ""], ["Confirmar nova senha", "password", ""], ["Autentica\u00e7\u00e3o em duas etapas", "checkbox", "Ativar autentica\u00e7\u00e3o em duas etapas"]] },
      notificacoes: { title: "Notifica\u00e7\u00f5es", subtitle: "Configure quais avisos devem chegar para a equipe.", fields: [["Receber propostas por e-mail", "checkbox", "Receber propostas por e-mail"], ["Receber alertas de prazo", "checkbox", "Receber alertas de prazo"], ["Receber mensagens de fornecedores", "checkbox", "Receber mensagens de fornecedores"], ["Receber resumo semanal", "checkbox", "Receber resumo semanal"]] }
    }
  },
  usina: {
    cancel: "dashboard-usina.html",
    button: "btn-orange",
    sections: {
      gerais: { title: "Informa\u00e7\u00f5es gerais", subtitle: "Dados industriais exibidos para empresas compradoras.", fields: [["Nome da usina", "text", "Usina Atlas Metais"], ["Nome fantasia", "text", "Atlas Metais"], ["Especialidade principal", "text", "Usinagem de precis\u00e3o"], ["Capacidade produtiva", "text", "12.000 pe\u00e7as/m\u00eas"], ["Descri\u00e7\u00e3o industrial", "textarea", "Usina especializada em usinagem CNC, corte, dobra e componentes industriais sob demanda."]] },
      contato: { title: "Contato", subtitle: "Canais da equipe comercial da usina.", fields: [["E-mail industrial", "email", "comercial@atlasmetais.com"], ["Telefone", "tel", "(31) 3333-4400"], ["WhatsApp", "tel", "(31) 98888-4400"], ["Respons\u00e1vel comercial", "text", "Carlos Mendes"]] },
      endereco: { title: "Endere\u00e7o", subtitle: "Localiza\u00e7\u00e3o operacional e regi\u00e3o de atendimento.", fields: [["CEP", "text", "32000-000"], ["Rua", "text", "Rodovia Industrial"], ["Cidade", "text", "Contagem"], ["Estado", "select", "MG", ["MG", "SP", "RJ", "PR", "SC", "RS"]], ["Regi\u00e3o de atendimento", "text", "Sudeste, Sul e Nordeste"]] },
      producao: { title: "Produ\u00e7\u00e3o", subtitle: "Capacidade operacional para avaliar pedidos.", fields: [["M\u00e1quinas dispon\u00edveis", "textarea", "Tornos CNC, centros de usinagem, corte laser, dobra CNC"], ["Capacidade mensal", "text", "12.000 pe\u00e7as"], ["Turnos", "select", "2 turnos", ["1 turno", "2 turnos", "3 turnos"]], ["Prazo m\u00e9dio", "text", "18 dias"]] },
      certificacoes: { title: "Certifica\u00e7\u00f5es", subtitle: "Compet\u00eancias e certificados produtivos.", fields: [["ISO 9001", "checkbox", "ISO 9001"], ["CNC", "checkbox", "CNC"], ["Corte laser", "checkbox", "Corte laser"], ["Fundi\u00e7\u00e3o", "checkbox", "Fundi\u00e7\u00e3o"], ["Soldagem", "checkbox", "Soldagem"]] },
      seguranca: { title: "Seguran\u00e7a", subtitle: "Proteja o acesso da equipe da usina.", fields: [["Senha atual", "password", ""], ["Nova senha", "password", ""], ["Confirmar senha", "password", ""]] },
      notificacoes: { title: "Notifica\u00e7\u00f5es", subtitle: "Configure os avisos comerciais da usina.", fields: [["Novos pedidos", "checkbox", "Novos pedidos"], ["Propostas aceitas", "checkbox", "Propostas aceitas"], ["Alertas de prazo", "checkbox", "Alertas de prazo"], ["Mensagens", "checkbox", "Mensagens"]] }
    }
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
}

function fieldMarkup(field) {
  const [label, type, value, options] = field;
  if (type === "textarea") return `<label class="field span-2"><span>${label}</span><textarea rows="6">${escapeHtml(value)}</textarea></label>`;
  if (type === "select") return `<label class="field"><span>${label}</span><div class="input-wrap select-field"><span class="input-symbol">v</span><select>${options.map((option) => `<option${option === value ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></div></label>`;
  if (type === "checkbox") return `<label class="toggle-field span-2"><input type="checkbox" checked><span></span><strong>${label || value}</strong></label>`;
  return `<label class="field"><span>${label}</span><div class="input-wrap"><span class="input-symbol">${type === "password" ? "*" : "T"}</span><input type="${type}" value="${escapeHtml(value)}"></div></label>`;
}

function renderProfileSection(sectionKey) {
  const kind = document.body.dataset.profileKind || "empresa";
  const profile = profileData[kind];
  const section = profile?.sections[sectionKey];
  const form = document.querySelector("#profile-dynamic-form");
  if (!section || !form) return;
  document.querySelector("#profile-section-title").textContent = section.title;
  document.querySelector("#profile-section-subtitle").textContent = section.subtitle;
  form.innerHTML = `${section.fields.map(fieldMarkup).join("")}
    <div class="form-actions span-2">
      <a class="btn btn-ghost" href="${profile.cancel}">Cancelar</a>
      <button class="btn ${profile.button}" type="submit">Salvar altera\u00e7\u00f5es</button>
    </div>`;
}

if (document.querySelector("#profile-dynamic-form")) renderProfileSection("gerais");

document.querySelectorAll("[data-profile-section]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    item.closest(".sidebar-card").querySelectorAll("a").forEach((link) => link.classList.remove("active"));
    item.classList.add("active");
    renderProfileSection(item.dataset.profileSection);
  });
});

document.querySelectorAll(".js-demo-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitter = event.submitter;
    const label = submitter ? submitter.textContent.trim() : "A\u00e7\u00e3o";
    const redirect = form.dataset.redirect;
    showToast(`${label} realizado com sucesso`);
    if (redirect) window.setTimeout(() => { window.location.href = redirect; }, 700);
  });
});

document.addEventListener("click", (event) => {
  const alertButton = event.target.closest(".js-alert");
  if (alertButton) showToast(`${alertButton.textContent.trim()} acionado`);
});

document.querySelectorAll(".js-table-search").forEach((input) => {
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    const container = input.closest("[data-search-scope]") || document;
    container.querySelectorAll("[data-search-row]").forEach((row) => {
      row.classList.toggle("is-hidden", query && !row.textContent.toLowerCase().includes(query));
    });
  });
});

function applyOrderFilter(container, filter) {
  const rows = [...container.querySelectorAll("[data-search-row]")];
  rows.forEach((row) => {
    let visible = true;
    if (filter === "alta") visible = row.dataset.urgency === "alta";
    if (filter === "sudeste") visible = row.dataset.region === "sudeste";
    row.classList.toggle("is-hidden", !visible);
  });
  if (filter === "prazo") {
    rows.sort((a, b) => Number(a.dataset.days || 999) - Number(b.dataset.days || 999));
    const parent = rows[0]?.parentElement;
    if (parent) rows.forEach((row) => parent.appendChild(row));
  }
}

document.querySelectorAll(".js-order-filter").forEach((button) => {
  button.addEventListener("click", () => {
    const container = button.closest("[data-search-scope]");
    button.parentElement.querySelectorAll(".filter-pill").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyOrderFilter(container, button.dataset.filter);
  });
});

const orderModal = document.querySelector("#order-modal");
function closeOrderModal() {
  if (orderModal) orderModal.hidden = true;
}

document.querySelectorAll(".js-open-order-detail").forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest("[data-search-row]");
    const cells = row.querySelectorAll("td");
    const facts = {};
    row.querySelectorAll(".quote-facts div").forEach((item) => {
      const key = item.querySelector("span")?.textContent.trim().toLowerCase();
      const value = item.querySelector("strong")?.textContent.trim();
      if (key) facts[key] = value;
    });
    const title = row.querySelector("h2")?.textContent || cells[0]?.textContent || "Pedido";
    const material = cells[1]?.textContent || facts.material || "";
    const quantity = cells[2]?.textContent || facts.quantidade || "";
    const deadline = cells[3]?.textContent || facts.prazo || "";
    const region = cells[4]?.textContent || facts["regi\u00e3o"] || "";
    document.querySelector("#order-modal-title").textContent = title;
    document.querySelector("#order-modal-content").innerHTML = `
      <div><span>Detalhes da pe\u00e7a</span><strong>${escapeHtml(title)}</strong></div>
      <div><span>Material</span><strong>${escapeHtml(material)}</strong></div>
      <div><span>Quantidade</span><strong>${escapeHtml(quantity)}</strong></div>
      <div><span>Descri\u00e7\u00e3o t\u00e9cnica</span><strong>${escapeHtml(row.dataset.description || "Solicita\u00e7\u00e3o com especifica\u00e7\u00f5es t\u00e9cnicas anexas.")}</strong></div>
      <div><span>Arquivo t\u00e9cnico fict\u00edcio</span><strong>${escapeHtml(row.dataset.file || "arquivo-tecnico.pdf")}</strong></div>
      <div><span>Prazo desejado</span><strong>${escapeHtml(deadline)}</strong></div>
      <div><span>Regi\u00e3o</span><strong>${escapeHtml(region)}</strong></div>`;
    if (orderModal) orderModal.hidden = false;
  });
});

document.querySelectorAll(".js-close-order-modal").forEach((button) => button.addEventListener("click", closeOrderModal));
if (orderModal) orderModal.addEventListener("click", (event) => { if (event.target === orderModal) closeOrderModal(); });

function statusClass(status) {
  if (status === "Ativo") return "success";
  if (status === "Pendente") return "warning";
  return "muted";
}

const employeeModal = document.querySelector("#employee-modal");
const employeeForm = document.querySelector("#employee-form");

function closeEmployeeModal() {
  if (!employeeModal || !employeeForm) return;
  employeeModal.hidden = true;
  employeeForm.reset();
}

document.querySelectorAll(".js-open-employee-modal").forEach((button) => {
  button.addEventListener("click", () => {
    if (!employeeModal || !employeeForm) return;
    employeeForm.dataset.context = button.dataset.employeeContext || "empresa";
    employeeModal.hidden = false;
    employeeForm.querySelector("input[name='name']").focus();
  });
});

document.querySelectorAll(".js-close-modal").forEach((button) => button.addEventListener("click", closeEmployeeModal));
if (employeeModal) employeeModal.addEventListener("click", (event) => { if (event.target === employeeModal) closeEmployeeModal(); });

if (employeeForm) {
  employeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const context = employeeForm.dataset.context || "empresa";
    const data = new FormData(employeeForm);
    const table = document.querySelector(`[data-employee-table="${context}"]`);
    if (table) {
      const row = document.createElement("tr");
      row.dataset.searchRow = "";
      row.innerHTML = `<td>${escapeHtml(data.get("name"))}</td><td>${escapeHtml(data.get("email"))}</td><td>${escapeHtml(data.get("role"))}</td><td>${escapeHtml(data.get("type"))}</td><td><span class="badge ${statusClass(data.get("status"))}">${escapeHtml(data.get("status"))}</span></td><td><button class="table-action js-alert" type="button">Editar</button></td>`;
      table.appendChild(row);
    }
    closeEmployeeModal();
    showToast("Funcion\u00e1rio adicionado com sucesso");
  });
}

function formatCurrencyLike(value, fallback) {
  const clean = value.trim();
  if (!clean) return fallback;
  return clean.startsWith("R$") ? clean : `R$ ${clean}`;
}

function updateProposalPreview() {
  const value = document.querySelector("#proposal-value");
  const deadline = document.querySelector("#proposal-deadline");
  const freight = document.querySelector("#proposal-freight");
  const note = document.querySelector("#proposal-note");
  if (!value) return;
  document.querySelector("#preview-value").textContent = formatCurrencyLike(value.value, "R$ 18.500,00");
  document.querySelector("#preview-deadline").textContent = deadline.value || "18 dias";
  document.querySelector("#preview-freight").textContent = formatCurrencyLike(freight.value, "R$ 950,00");
  document.querySelector("#preview-note").textContent = note.value || "Proposta com inspe\u00e7\u00e3o dimensional e embalagem refor\u00e7ada.";
}

document.querySelectorAll("#proposal-value, #proposal-deadline, #proposal-freight, #proposal-note").forEach((input) => {
  input.addEventListener("input", updateProposalPreview);
});

document.querySelectorAll(".js-send-proposal").forEach((button) => {
  button.addEventListener("click", () => {
    updateProposalPreview();
    showToast("Proposta enviada com sucesso");
    window.setTimeout(() => { window.location.href = "propostas-enviadas.html"; }, 800);
  });
});
