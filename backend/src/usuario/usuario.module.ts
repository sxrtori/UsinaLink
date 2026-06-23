import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Usina } from '../usina/usina.entity';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { usuarioProviders } from './usuario.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Empresa, Usina])],
  controllers: [UsuarioController],
  providers: [...usuarioProviders]
})
export class UsuarioModule {}
