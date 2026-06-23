export class CreateEmpresaDto {
  nome: string;
  cnpj: string;
  email: string;
  razaoSocial?: string;
  telefone?: string;
  responsavel?: string;
  cargo?: string;
  endereco?: Record<string, unknown>;
}
