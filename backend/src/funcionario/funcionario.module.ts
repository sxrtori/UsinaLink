import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FuncionarioController } from './funcionario.controller';
import { funcionarioProviders } from './funcionario.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [FuncionarioController],
  providers: [...funcionarioProviders]
})
export class FuncionarioModule {}
