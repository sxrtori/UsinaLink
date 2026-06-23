export class CreateAvaliacaoDto {
  pedidoId: string;
  notaGeral: number;
  qualidade: number;
  prazo: number;
  comunicacao: number;
  comentario?: string;
  empresaId?: string;
  usinaId?: string;
}
