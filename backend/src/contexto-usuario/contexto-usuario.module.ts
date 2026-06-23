import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa, Funcionario, Usina } from '../common/entities/core.entities';
import { ContextoUsuarioService } from './contexto-usuario.service';
@Module({ imports:[TypeOrmModule.forFeature([Empresa, Usina, Funcionario])], providers:[ContextoUsuarioService], exports:[ContextoUsuarioService] })
export class ContextoUsuarioModule {}
