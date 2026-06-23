import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoController } from './pedido.controller';
import { Pedido } from './pedido.entity';
import { pedidoProviders } from './pedido.provider';
import { PedidoService } from './pedido.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido])],
  controllers: [PedidoController],
  providers: [...pedidoProviders],
  exports: [PedidoService]
})
export class PedidoModule {}
