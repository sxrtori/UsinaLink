import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../services/database.service';

@Controller('api/funcionarios')
export class FuncionariosController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  list(@Query('contexto') contexto?: string) {
    const funcionarios = this.db.getFuncionarios();
    return contexto ? funcionarios.filter((item: any) => item.contexto === contexto) : funcionarios;
  }

  @Post()
  create(@Body() body: any) {
    const funcionarios = this.db.getFuncionarios();
    const funcionario = {
      id: `func-${randomUUID()}`,
      contexto: body.contexto || 'empresa',
      ownerId: body.ownerId || null,
      nome: body.nome,
      email: body.email,
      cargo: body.cargo,
      tipo: body.tipo,
      conviteToken: body.conviteToken || randomUUID(),
      status: 'Pendente'
    };
    funcionarios.push(funcionario);
    this.db.salvarFuncionarios(funcionarios);
    return { message: 'Funcionario criado.', funcionario };
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    const funcionario = this.db.getFuncionarios().find((item: any) => item.id === id || item.conviteToken === id);
    if (!funcionario) throw new HttpException({ message: 'Funcionario nao encontrado.' }, HttpStatus.NOT_FOUND);
    return funcionario;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const funcionarios = this.db.getFuncionarios();
    const index = funcionarios.findIndex((item: any) => item.id === id);
    if (index === -1) throw new HttpException({ message: 'Funcionario nao encontrado.' }, HttpStatus.NOT_FOUND);
    funcionarios[index] = { ...funcionarios[index], ...body };
    this.db.salvarFuncionarios(funcionarios);
    return { message: 'Funcionario atualizado.', funcionario: funcionarios[index] };
  }

  @Post(':id/reenviar-convite')
  reenviar() {
    return { message: 'Convite reenviado com sucesso.' };
  }

  @Put(':id/aceitar-convite')
  acceptInvite(@Param('id') id: string) {
    return this.changeStatus(id, 'Ativo', 'Convite aceito com sucesso.');
  }

  @Put(':id/inativar')
  inactivate(@Param('id') id: string) {
    return this.changeStatus(id, 'Inativo', 'Funcionario inativado.');
  }

  @Put(':id/ativar')
  activate(@Param('id') id: string) {
    return this.changeStatus(id, 'Ativo', 'Funcionario ativado com sucesso.');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const funcionarios = this.db.getFuncionarios();
    const index = funcionarios.findIndex((item: any) => item.id === id);
    if (index === -1) throw new HttpException({ message: 'Funcionario nao encontrado.' }, HttpStatus.NOT_FOUND);
    const [funcionario] = funcionarios.splice(index, 1);
    this.db.salvarFuncionarios(funcionarios);
    return { message: 'Funcionario excluido definitivamente.', funcionario };
  }

  private changeStatus(id: string, status: string, message: string) {
    const funcionarios = this.db.getFuncionarios();
    const index = funcionarios.findIndex((item: any) => item.id === id || item.conviteToken === id);
    if (index === -1) throw new HttpException({ message: 'Funcionario nao encontrado.' }, HttpStatus.NOT_FOUND);
    funcionarios[index].status = status;
    this.db.salvarFuncionarios(funcionarios);
    return { message, funcionario: funcionarios[index] };
  }
}
