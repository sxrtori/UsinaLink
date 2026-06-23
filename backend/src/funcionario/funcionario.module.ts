import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuncionarioController } from './funcionario.controller';
import { Funcionario } from './funcionario.entity';
import { funcionarioProviders } from './funcionario.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  controllers: [FuncionarioController],
  providers: [...funcionarioProviders]
})
export class FuncionarioModule {}
