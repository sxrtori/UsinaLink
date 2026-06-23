import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BloqueioUsina, Empresa, EnderecoEmpresa, EnderecoUsina, Funcionario, Usuario, Usina } from '../common/entities/core.entities';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
@Module({ imports:[TypeOrmModule.forFeature([Usuario, Empresa, Usina, EnderecoEmpresa, EnderecoUsina, Funcionario, BloqueioUsina]), AuthModule], controllers:[UsuarioController], providers:[UsuarioService], exports:[UsuarioService] })
export class UsuarioModule {}
