import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../common/entities/core.entities';

@Injectable()
export class EmpresaService {
  constructor(@InjectRepository(Empresa) private empresaRepo: Repository<Empresa>) {}

  async buscar(nome?: string, cnpj?: string) {
    if (cnpj) {
      const cnpjLimpo = String(cnpj).replace(/\D/g, '');
      return await this.empresaRepo.findOne({ where: { cnpj: cnpjLimpo } });
    }
    
    if (nome) {
      const nomeBusca = String(nome).toLowerCase();
      return await this.empresaRepo.findOne({
        where: [
          { nomeFantasia: nomeBusca },
          { razaoSocial: nomeBusca }
        ]
      });
    }
    
    return null;
  }

  async porId(id: any) {
    const idNumerico = Number(id);
    const empresa = await this.empresaRepo.findOne({ 
      where: { idEmpresa: idNumerico } 
    });
    
    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada.');
    }
    
    return empresa;
  }
}
