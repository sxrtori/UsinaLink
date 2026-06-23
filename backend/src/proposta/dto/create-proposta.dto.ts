export class CreatePropostaDto {
  pedidoId?: string;
  solicitacaoId?: string;
  usinaId: string;
  empresaId?: string;
  usina?: string;
  cliente?: string;
  peca?: string;
  valor: string;
  prazo: string;
  frete?: string;
  avaliacao?: string;
  observacao?: string;
}
