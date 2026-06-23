import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDatabaseService } from '../database/json-database.service';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { Funcionario } from './funcionario.entity';

@Injectable()
export class FuncionarioService {
  constructor(private readonly database: JsonDatabaseService) {}

  async findAll(contexto?: string) {
    const funcionarios = await this.database.findAll<Funcionario>('funcionarios');
    return contexto ? funcionarios.filter(funcionario => funcionario.contexto === contexto) : funcionarios;
  }

  async findOne(id: string) {
    const item = await this.database.findOne<Funcionario>(
      'funcionarios',
      funcionario => funcionario.id === id || funcionario.conviteToken === id
    );
    if (!item) throw new NotFoundException('Funcionario nao encontrado.');
    return item;
  }

  create(dto: CreateFuncionarioDto) {
    return this.database.insert<Funcionario>('funcionarios', {
      ...dto,
      id: `func-${randomUUID()}`,
      contexto: dto.contexto || 'empresa',
      conviteToken: dto.conviteToken || randomUUID(),
      status: 'Pendente'
    });
  }

  async update(id: string, dto: UpdateFuncionarioDto) {
    const item = await this.database.updateWhere<Funcionario>(
      'funcionarios',
      funcionario => funcionario.id === id || funcionario.conviteToken === id,
      dto
    );
    if (!item) throw new NotFoundException('Funcionario nao encontrado.');
    return item;
  }

  async remove(id: string) {
    const item = await this.database.removeWhere<Funcionario>(
      'funcionarios',
      funcionario => funcionario.id === id || funcionario.conviteToken === id
    );
    if (!item) throw new NotFoundException('Funcionario nao encontrado.');
    return item;
  }
}
