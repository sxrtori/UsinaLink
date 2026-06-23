export class Avaliacao {
  id: string;
  pedidoId: string;
  empresaId: string;
  usinaId: string;
  notaGeral: number;
  qualidade: number;
  prazo: number;
  comunicacao: number;
  comentario?: string;
  respostaDaUsina?: string;
  criadoEm: string;
  atualizadoEm: string;
}
