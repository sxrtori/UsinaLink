import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AvaliacaoController } from './avaliacao.controller';
import { avaliacaoProviders } from './avaliacao.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [AvaliacaoController],
  providers: [...avaliacaoProviders]
})
export class AvaliacaoModule {}
