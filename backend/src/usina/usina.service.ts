import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../database/json-database.service';
import { Usina } from './usina.entity';

@Injectable()
export class UsinaService {
  constructor(private readonly database: JsonDatabaseService) {}

  buscar(nome?: string, cnpj?: string) {
    if (cnpj) {
      const cleanCnpj = cnpj.replace(/\D/g, '');
      return this.database.findOne<Usina>('usinas', usina => usina.cnpj === cleanCnpj);
    }

    const search = String(nome || '').toLowerCase();
    return this.database.findOne<Usina>('usinas', usina => String(usina.nome || '').toLowerCase().includes(search));
  }
}
