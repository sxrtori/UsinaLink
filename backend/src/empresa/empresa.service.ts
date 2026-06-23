import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../database/json-database.service';
import { Empresa } from './empresa.entity';

@Injectable()
export class EmpresaService {
  constructor(private readonly database: JsonDatabaseService) {}

  buscar(nome?: string, cnpj?: string) {
    if (cnpj) {
      const cleanCnpj = cnpj.replace(/\D/g, '');
      return this.database.findOne<Empresa>('empresas', empresa => empresa.cnpj === cleanCnpj);
    }

    const search = String(nome || '').toLowerCase();
    return this.database.findOne<Empresa>('empresas', empresa => String(empresa.nome || '').toLowerCase().includes(search));
  }
}
