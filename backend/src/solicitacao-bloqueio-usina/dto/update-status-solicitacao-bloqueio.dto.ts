import { SolicitacaoBloqueioStatus } from '../solicitacao-bloqueio-usina.entity';

export class UpdateStatusSolicitacaoBloqueioDto {
  status: SolicitacaoBloqueioStatus;
  respostaModeracao?: string;
  analisadoPor?: string;
}
