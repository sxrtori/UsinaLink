import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';
import { Funcionario } from './funcionario.entity';

@Injectable()
export class FuncionarioService {
  constructor(@InjectRepository(Funcionario) private readonly repository: Repository<Funcionario>) {}
  findAll(contexto?: string) { return contexto ? this.repository.findBy({ contexto }) : this.repository.find(); }
  async findOne(id: string) {
    const item = await this.repository.createQueryBuilder('f').where('f.id = :id OR f.conviteToken = :id', { id }).getOne();
    if (!item) throw new NotFoundException('Funcionario nao encontrado.');
    return item;
  }
  create(dto: CreateFuncionarioDto) {
    return this.repository.save(this.repository.create({ ...dto, id: `func-${randomUUID()}`, contexto: dto.contexto || 'empresa', conviteToken: dto.conviteToken || randomUUID(), status: 'Pendente' }));
  }
  async update(id: string, dto: UpdateFuncionarioDto) {
    const item = await this.findOne(id);
    return this.repository.save(this.repository.merge(item, dto));
  }
  async remove(id: string) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return item;
  }
}
