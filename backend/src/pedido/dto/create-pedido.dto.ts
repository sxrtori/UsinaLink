export class CreatePedidoDto {
  empresaId: string;
  empresa: string;
  peca: string;
  categoria?: string;
  material?: string;
  quantidade?: string;
  prazo?: string;
  regiao?: string;
  urgencia?: string;
  descricao?: string;
  arquivo?: string;
}
