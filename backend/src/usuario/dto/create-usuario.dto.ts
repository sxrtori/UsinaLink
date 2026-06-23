export class CreateUsuarioDto {
  tipo?: string;
  type?: string;
  nome: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
  confirmar_senha?: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  cargo?: string;
  responsavel?: string;
  especialidade?: string;
}
