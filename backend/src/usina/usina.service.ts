import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usina } from '../common/entities/core.entities';

@Injectable()
export class UsinaService {
  constructor(@InjectRepository(Usina) private usinaRepo: Repository<Usina>) {}

  async buscar(nome?: string, cnpj?: string) {
    if (cnpj) {
      const cnpjLimpo = String(cnpj).replace(/\D/g, '');
      return await this.usinaRepo.findOne({ where: { cnpj: cnpjLimpo } });
    }
    
    if (nome) {
      const nomeBusca = String(nome).toLowerCase();
      return await this.usinaRepo.findOne({
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
    const usina = await this.usinaRepo.findOne({ 
      where: { idUsina: idNumerico } 
    });
    
    if (!usina) {
      throw new NotFoundException('Usina não encontrada.');
    }
    
    return usina;
  }
}
