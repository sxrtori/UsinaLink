import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PedidoController } from './pedido.controller';
import { pedidoProviders } from './pedido.provider';
import { PedidoService } from './pedido.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PedidoController],
  providers: [...pedidoProviders],
  exports: [PedidoService]
})
export class PedidoModule {}
