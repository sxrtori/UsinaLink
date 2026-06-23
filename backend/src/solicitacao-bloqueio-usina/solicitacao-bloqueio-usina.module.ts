import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SolicitacaoBloqueioUsinaController } from './solicitacao-bloqueio-usina.controller';
import { solicitacaoBloqueioUsinaProviders } from './solicitacao-bloqueio-usina.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SolicitacaoBloqueioUsinaController],
  providers: [...solicitacaoBloqueioUsinaProviders],
  exports: [...solicitacaoBloqueioUsinaProviders]
})
export class SolicitacaoBloqueioUsinaModule {}
