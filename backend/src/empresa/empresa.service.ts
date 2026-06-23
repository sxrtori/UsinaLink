import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(@InjectRepository(Empresa) private readonly repository: Repository<Empresa>) {}

  buscar(nome?: string, cnpj?: string) {
    if (cnpj) return this.repository.findOneBy({ cnpj: cnpj.replace(/\D/g, '') });
    return this.repository.createQueryBuilder('empresa')
      .where('LOWER(empresa.nome) LIKE LOWER(:nome)', { nome: `%${nome || ''}%` })
      .getOne();
  }
}
