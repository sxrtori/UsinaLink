(function () {
  window.UsinaLinkMockPayments = {
    orders: [
      {
        id: "pedido-1",
        empresaId: "empresa-1",
        empresa: "Metal Forte",
        usinaId: "usina-1",
        usina: "Usina Atlas Metais",
        peca: "Eixo estriado",
        descricao: "Eixo para conjunto de transmissao com tolerancia dimensional e tratamento termico.",
        material: "Aco 4140 temperado",
        quantidade: "60 unidades",
        prazo: "20 dias",
        regiao: "Sudeste",
        arquivo: "desenho-eixo-estriado.pdf",
        status: "Aguardando pagamento",
        endereco: "Av. Paulista, 1000 - Sao Paulo/SP",
        dataCriacao: "2026-05-26T10:00:00.000Z",
        valor: "R$ 18.500,00"
      },
      {
        id: "pedido-2",
        empresaId: "empresa-2",
        empresa: "Energia Sul",
        usinaId: "usina-1",
        usina: "Usina Atlas Metais",
        peca: "Flange industrial",
        descricao: "Flange para linha industrial com acabamento usinado e inspecao dimensional.",
        material: "Aco carbono",
        quantidade: "45 unidades",
        prazo: "12 dias",
        regiao: "Sul",
        arquivo: "flange-industrial.dwg",
        status: "Em producao",
        endereco: "Rua Industrial, 455 - Porto Alegre/RS",
        dataCriacao: "2026-05-24T14:30:00.000Z",
        valor: "R$ 42.000,00"
      }
    ],
    proposals: [
      {
        id: "proposta-1",
        pedidoId: "pedido-1",
        usinaId: "usina-1",
        empresaId: "empresa-1",
        usina: "Usina Atlas Metais",
        cliente: "Metal Forte",
        peca: "Eixo estriado",
        valor: "R$ 18.500,00",
        prazo: "18 dias",
        frete: "R$ 950,00",
        status: "Aceita",
        observacao: "Proposta com inspecao dimensional e embalagem reforcada."
      }
    ]
  };
}());
