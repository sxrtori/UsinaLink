import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PedidoModule } from '../pedido/pedido.module';
import { SolicitacaoBloqueioUsinaModule } from '../solicitacao-bloqueio-usina/solicitacao-bloqueio-usina.module';
import { PropostaController } from './proposta.controller';
import { propostaProviders } from './proposta.provider';

@Module({
  imports: [DatabaseModule, PedidoModule, SolicitacaoBloqueioUsinaModule],
  controllers: [PropostaController],
  providers: [...propostaProviders]
})
export class PropostaModule {}
