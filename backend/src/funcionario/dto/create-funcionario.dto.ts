export class CreateFuncionarioDto {
  contexto?: string;
  ownerId?: string;
  nome: string;
  email: string;
  cargo?: string;
  tipo?: string;
  conviteToken?: string;
}
