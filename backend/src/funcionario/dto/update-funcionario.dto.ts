import { CreateFuncionarioDto } from './create-funcionario.dto';
export type UpdateFuncionarioDto = Partial<CreateFuncionarioDto> & { status?: string };
