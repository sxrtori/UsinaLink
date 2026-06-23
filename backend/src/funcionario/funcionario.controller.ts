import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { FuncionarioService } from './funcionario.service';

@Controller('api/funcionarios')
export class FuncionarioController {
  constructor(private readonly service: FuncionarioService) {}
  @Get() findAll(@Query('contexto') contexto?: string) { return this.service.findAll(contexto); }
  @Post() async create(@Body() dto: CreateFuncionarioDto) { return { message: 'Funcionario criado.', funcionario: await this.service.create(dto) }; }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: UpdateFuncionarioDto) { return { message: 'Funcionario atualizado.', funcionario: await this.service.update(id, dto) }; }
  @Post(':id/reenviar-convite') reenviar() { return { message: 'Convite reenviado com sucesso.' }; }
  @Put(':id/aceitar-convite') async accept(@Param('id') id: string) { return { message: 'Convite aceito com sucesso.', funcionario: await this.service.update(id, { status: 'Ativo' }) }; }
  @Put(':id/inativar') async inactivate(@Param('id') id: string) { return { message: 'Funcionario inativado.', funcionario: await this.service.update(id, { status: 'Inativo' }) }; }
  @Put(':id/ativar') async activate(@Param('id') id: string) { return { message: 'Funcionario ativado com sucesso.', funcionario: await this.service.update(id, { status: 'Ativo' }) }; }
  @Delete(':id') async remove(@Param('id') id: string) { return { message: 'Funcionario excluido definitivamente.', funcionario: await this.service.remove(id) }; }
}
