import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoModule } from '../pedido/pedido.module';
import { PropostaController } from './proposta.controller';
import { Proposta } from './proposta.entity';
import { propostaProviders } from './proposta.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Proposta]), PedidoModule],
  controllers: [PropostaController],
  providers: [...propostaProviders]
})
export class PropostaModule {}
