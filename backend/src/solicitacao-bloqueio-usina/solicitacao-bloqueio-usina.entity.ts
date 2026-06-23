export type SolicitacaoBloqueioStatus = 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'cancelada';

export class SolicitacaoBloqueioUsina {
  id: string;
  empresaId: string;
  usinaId: string;
  pedidoId?: string;
  motivo: string;
  descricao: string;
  status: SolicitacaoBloqueioStatus;
  respostaModeracao?: string;
  analisadoPor?: string;
  criadoEm: string;
  atualizadoEm: string;
  analisadoEm?: string;
}
