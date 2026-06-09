import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../services/database.service';
import { isValidCnpj, isValidCpf, isValidEmail, normalizeEmail, normalizeTipo, onlyDigits } from '../services/validators';

function linkedIdKey(tipo: string) {
  if (tipo === 'empresa') return 'empresaId';
  if (tipo === 'usina') return 'usinaId';
  return 'pessoaFisicaId';
}

@Controller('api/cadastro')
export class CadastroController {
  constructor(private readonly db: DatabaseService) {}

  @Post()
  registerDefault(@Body() body: any) {
    return this.register(body);
  }

  @Post('empresa')
  registerEmpresa(@Body() body: any) {
    return this.register({ ...body, tipo: 'empresa' });
  }

  @Post('usina')
  registerUsina(@Body() body: any) {
    return this.register({ ...body, tipo: 'usina' });
  }

  @Post('pessoa_fisica')
  registerPessoaFisica(@Body() body: any) {
    return this.register({ ...body, tipo: 'pessoa_fisica' });
  }

  @Post('pessoa-fisica')
  registerPessoaFisicaAlias(@Body() body: any) {
    return this.register({ ...body, tipo: 'pessoa_fisica' });
  }

  private register(body: any) {
    const data = {
      tipo: normalizeTipo(body.tipo || body.type),
      nome: String(body.nome || '').trim(),
      email: normalizeEmail(body.email),
      senha: String(body.senha || ''),
      confirmarSenha: String(body.confirmarSenha || body.confirmar_senha || ''),
      cpf: onlyDigits(body.cpf),
      cnpj: onlyDigits(body.cnpj),
      telefone: onlyDigits(body.telefone),
      cargo: String(body.cargo || '').trim(),
      responsavel: String(body.responsavel || '').trim(),
      especialidade: String(body.especialidade || '').trim()
    };
    const errors: string[] = [];

    if (!['empresa', 'pessoa_fisica', 'usina'].includes(data.tipo)) errors.push('Tipo de conta invalido.');
    if (!data.nome) errors.push('Nome e obrigatorio.');
    if (!data.email) errors.push('E-mail e obrigatorio.');
    if (data.email && !isValidEmail(data.email)) errors.push('E-mail em formato invalido.');
    if (!data.senha) errors.push('Senha e obrigatoria.');
    if (data.senha && data.senha.length < 6) errors.push('Senha deve ter no minimo 6 caracteres.');
    if (data.confirmarSenha && data.senha !== data.confirmarSenha) errors.push('Senha e confirmar senha precisam ser iguais.');
    if (data.tipo === 'pessoa_fisica' && (!data.cpf || !isValidCpf(data.cpf))) errors.push('CPF valido e obrigatorio.');
    if ((data.tipo === 'empresa' || data.tipo === 'usina') && (!data.cnpj || !isValidCnpj(data.cnpj))) errors.push('Informe um CNPJ valido no formato 00.000.000/0000-00.');

    const users = this.db.getUsuarios();
    if (users.some((user: any) => user.email === data.email)) errors.push('E-mail ja cadastrado.');
    if (data.cpf && users.some((user: any) => user.cpf === data.cpf)) errors.push('CPF ja cadastrado.');
    if (data.cnpj && users.some((user: any) => user.cnpj === data.cnpj)) errors.push('CNPJ ja cadastrado.');

    if (errors.length) throw new HttpException({ message: 'Nao foi possivel cadastrar.', errors }, HttpStatus.BAD_REQUEST);

    const linkedId = `${data.tipo}-${randomUUID()}`;
    const user = {
      id: `user-${randomUUID()}`,
      tipo: data.tipo,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      [linkedIdKey(data.tipo)]: linkedId,
      cpf: data.cpf || null,
      cnpj: data.cnpj || null
    };
    users.push(user);
    this.db.salvarUsuarios(users);

    if (data.tipo === 'empresa') {
      const empresas = this.db.getEmpresas();
      empresas.push({ id: linkedId, nome: data.nome, cnpj: data.cnpj, email: data.email, telefone: data.telefone, responsavel: data.responsavel, cargo: data.cargo });
      this.db.salvarEmpresas(empresas);
    }
    if (data.tipo === 'usina') {
      const usinas = this.db.getUsinas();
      usinas.push({ id: linkedId, nome: data.nome, cnpj: data.cnpj, email: data.email, telefone: data.telefone, responsavel: data.responsavel, especialidade: data.especialidade });
      this.db.salvarUsinas(usinas);
    }
    if (data.tipo === 'pessoa_fisica') {
      const pessoas = this.db.getPessoasFisicas();
      pessoas.push({ id: linkedId, nome: data.nome, cpf: data.cpf, email: data.email, telefone: data.telefone });
      this.db.salvarPessoasFisicas(pessoas);
    }

    const { senha: _senha, ...safeUser } = user;
    return { message: 'Cadastro realizado com sucesso.', user: safeUser };
  }
}
