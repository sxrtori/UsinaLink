import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsinaController } from './usina.controller';
import { Usina } from './usina.entity';
import { usinaProviders } from './usina.provider';
import { UsinaService } from './usina.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usina])],
  controllers: [UsinaController],
  providers: [...usinaProviders],
  exports: [TypeOrmModule, UsinaService]
})
export class UsinaModule {}
