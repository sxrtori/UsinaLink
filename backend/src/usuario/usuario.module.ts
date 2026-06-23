import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsuarioController } from './usuario.controller';
import { usuarioProviders } from './usuario.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [UsuarioController],
  providers: [...usuarioProviders]
})
export class UsuarioModule {}
