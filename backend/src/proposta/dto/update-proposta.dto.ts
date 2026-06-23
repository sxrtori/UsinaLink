import { CreatePropostaDto } from './create-proposta.dto';
export type UpdatePropostaDto = Partial<CreatePropostaDto> & { status?: string };
