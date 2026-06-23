import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsinaController } from './usina.controller';
import { usinaProviders } from './usina.provider';
import { UsinaService } from './usina.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsinaController],
  providers: [...usinaProviders],
  exports: [UsinaService]
})
export class UsinaModule {}
