import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { onlyDigits } from './validators';

function normalizeText(value: unknown) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

@Injectable()
export class CnpjService {
  constructor(private readonly db: DatabaseService) {}

  private organizations() {
    return [
      ...this.db.getEmpresas().map((item: any) => ({ ...item, tipo: 'empresa' })),
      ...this.db.getUsinas().map((item: any) => ({ ...item, tipo: 'usina' }))
    ];
  }

  buscarPorNome(nome: string, tipo?: string) {
    const query = normalizeText(nome);
    return this.organizations().find((item: any) => (!tipo || item.tipo === tipo) && normalizeText(item.nome).includes(query));
  }

  buscarPorCnpj(cnpj: string, tipo?: string) {
    const clean = onlyDigits(cnpj);
    return this.organizations().find((item: any) => (!tipo || item.tipo === tipo) && onlyDigits(item.cnpj) === clean);
  }
}
