import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDatabaseService } from '../database/json-database.service';
import { Empresa } from '../empresa/empresa.entity';
import { Usina } from '../usina/usina.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { Usuario } from './usuario.entity';

const digits = (value: unknown) => String(value || '').replace(/\D/g, '');
const email = (value: unknown) => String(value || '').trim().toLowerCase();
const tipo = (value: unknown) => ['pessoa', 'pessoa-fisica'].includes(String(value || '')) ? 'pessoa_fisica' : String(value || '');

function validCpf(value: string) {
  if (value.length !== 11 || /^(\d)\1+$/.test(value)) return false;
  const calculate = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) sum += Number(value[index]) * (length + 1 - index);
    const digit = (sum * 10) % 11;
    return digit === 10 ? 0 : digit;
  };
  return calculate(9) === Number(value[9]) && calculate(10) === Number(value[10]);
}

@Injectable()
export class UsuarioService {
  constructor(private readonly database: JsonDatabaseService) {}

  async login(dto: LoginDto) {
    const user = await this.database.findOne<Usuario>('usuarios', usuario => usuario.email === email(dto.email));
    if (!user) throw new NotFoundException('Usuario nao encontrado');
    if (user.senha !== String(dto.senha || '')) throw new UnauthorizedException('Senha incorreta');
    if (user.tipo !== tipo(dto.tipo)) throw new ForbiddenException('Esta conta nao pertence a esta area de login');
    const { senha: _, ...safeUser } = user;
    return safeUser;
  }

  async register(body: CreateUsuarioDto, forcedType?: string) {
    const data = {
      tipo: tipo(forcedType || body.tipo || body.type), nome: String(body.nome || '').trim(), email: email(body.email),
      senha: String(body.senha || ''), confirmarSenha: String(body.confirmarSenha || body.confirmar_senha || ''),
      cpf: digits(body.cpf), cnpj: digits(body.cnpj), telefone: digits(body.telefone),
      cargo: String(body.cargo || '').trim(), responsavel: String(body.responsavel || '').trim(), especialidade: String(body.especialidade || '').trim()
    };
    const errors: string[] = [];
    if (!['empresa', 'pessoa_fisica', 'usina'].includes(data.tipo)) errors.push('Tipo de conta invalido.');
    if (!data.nome) errors.push('Nome e obrigatorio.');
    if (!data.email) errors.push('E-mail e obrigatorio.');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push('E-mail em formato invalido.');
    if (!data.senha) errors.push('Senha e obrigatoria.');
    if (data.senha && data.senha.length < 6) errors.push('Senha deve ter no minimo 6 caracteres.');
    if (data.confirmarSenha && data.senha !== data.confirmarSenha) errors.push('Senha e confirmar senha precisam ser iguais.');
    if (data.tipo === 'pessoa_fisica' && (!data.cpf || !validCpf(data.cpf))) errors.push('CPF valido e obrigatorio.');
    if (['empresa', 'usina'].includes(data.tipo) && data.cnpj.length !== 14) errors.push('Informe um CNPJ valido no formato 00.000.000/0000-00.');
    const duplicate = await this.database.findOne<Usuario>(
      'usuarios',
      usuario => usuario.email === data.email || Boolean(data.cpf && usuario.cpf === data.cpf) || Boolean(data.cnpj && usuario.cnpj === data.cnpj)
    );
    if (duplicate?.email === data.email) errors.push('E-mail ja cadastrado.');
    if (data.cpf && duplicate?.cpf === data.cpf) errors.push('CPF ja cadastrado.');
    if (data.cnpj && duplicate?.cnpj === data.cnpj) errors.push('CNPJ ja cadastrado.');
    if (errors.length) throw new BadRequestException({ message: 'Nao foi possivel cadastrar.', errors });

    const linkedId = `${data.tipo}-${randomUUID()}`;
    const user: Usuario = {
      id: `user-${randomUUID()}`,
      tipo: data.tipo,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      cpf: data.cpf || null,
      cnpj: data.cnpj || null,
      telefone: data.telefone || null,
      empresaId: data.tipo === 'empresa' ? linkedId : null,
      usinaId: data.tipo === 'usina' ? linkedId : null,
      pessoaFisicaId: data.tipo === 'pessoa_fisica' ? linkedId : null
    };

    await this.database.insert<Usuario>('usuarios', user);

    if (data.tipo === 'empresa') {
      await this.database.insert<Empresa>('empresas', {
        id: linkedId,
        nome: data.nome,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
        responsavel: data.responsavel,
        cargo: data.cargo
      });
    }

    if (data.tipo === 'usina') {
      await this.database.insert<Usina>('usinas', {
        id: linkedId,
        nome: data.nome,
        cnpj: data.cnpj,
        email: data.email,
        telefone: data.telefone,
        responsavel: data.responsavel,
        especialidade: data.especialidade
      });
    }

    const { senha: _, ...safeUser } = user;
    return safeUser;
  }
}
