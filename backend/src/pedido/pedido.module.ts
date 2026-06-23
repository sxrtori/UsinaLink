import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';
import { Pedido, Proposta, Empresa, HistoricoStatusPedido } from '../common/entities/core.entities';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';

@Module({
  imports: [
    AuthModule,
    ContextoUsuarioModule,
    TypeOrmModule.forFeature([Pedido, Proposta, Empresa, HistoricoStatusPedido])
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService]
})
export class PedidoModule {}
