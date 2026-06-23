export class CreateUsinaDto {
  nome: string;
  cnpj: string;
  email: string;
  razaoSocial?: string;
  telefone?: string;
  responsavel?: string;
  especialidade?: string;
  endereco?: Record<string, unknown>;
}
