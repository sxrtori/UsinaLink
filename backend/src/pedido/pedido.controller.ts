import { Controller, Get } from '@nestjs/common';
import { PedidoService } from './pedido.service';

@Controller('api/pedidos')
export class PedidoController {
  constructor(private readonly service: PedidoService) {}
  @Get() findAll() { return this.service.findAll(); }
}
