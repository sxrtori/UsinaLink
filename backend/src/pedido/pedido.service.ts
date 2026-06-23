import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';

@Injectable()
export class PedidoService {
  constructor(@InjectRepository(Pedido) private readonly repository: Repository<Pedido>) {}
  findAll() { return this.repository.find(); }
  findOne(id: string) { return this.repository.findOneBy({ id }); }
}
