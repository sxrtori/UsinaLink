import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usina } from './usina.entity';

@Injectable()
export class UsinaService {
  constructor(@InjectRepository(Usina) private readonly repository: Repository<Usina>) {}
  buscar(nome?: string, cnpj?: string) {
    if (cnpj) return this.repository.findOneBy({ cnpj: cnpj.replace(/\D/g, '') });
    return this.repository.createQueryBuilder('usina')
      .where('LOWER(usina.nome) LIKE LOWER(:nome)', { nome: `%${nome || ''}%` }).getOne();
  }
}
