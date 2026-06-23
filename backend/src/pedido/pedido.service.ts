import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../database/json-database.service';
import { Pedido } from './pedido.entity';

@Injectable()
export class PedidoService {
  constructor(private readonly database: JsonDatabaseService) {}

  findAll() {
    return this.database.findAll<Pedido>('pedidos');
  }

  findOne(id: string) {
    return this.database.findOne<Pedido>('pedidos', pedido => pedido.id === id);
  }
}
