import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';

@Controller('api/pedidos')
export class PedidosController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  list() {
    return this.db.getPedidos();
  }
}
