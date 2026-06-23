import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Funcionario } from '../common/entities/core.entities';

@Injectable()
export class FuncionarioService {
  constructor(@InjectRepository(Funcionario) private funcionarioRepo: Repository<Funcionario>) {}

  findAll(contexto?: string) {
    if (contexto === 'usina') {
      return this.funcionarioRepo.find({ where: { idEmpresa: IsNull() } });
    }
    return this.funcionarioRepo.find();
  }

  async findOne(id: string) {
    const idNumerico = Number(id);
    const funcionario = await this.funcionarioRepo.findOne({ where: { idFuncionario: idNumerico } });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado.');
    }
    return funcionario;
  }

  create(dto: any) {
    const funcionario = this.funcionarioRepo.create({
      ...dto,
      status: 'pendente'
    });
    return this.funcionarioRepo.save(funcionario);
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    await this.funcionarioRepo.update(Number(id), dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const funcionario = await this.findOne(id);
    if (funcionario.status !== 'inativo') {
      await this.funcionarioRepo.update(Number(id), { status: 'inativo' });
      return { ...funcionario, status: 'inativo' };
    }
    await this.funcionarioRepo.delete(Number(id));
    return funcionario;
  }
}
