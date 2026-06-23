import { Module } from '@nestjs/common';
import { ContextoUsuarioService } from './contexto-usuario.service';
@Module({ providers:[ContextoUsuarioService], exports:[ContextoUsuarioService] })
export class ContextoUsuarioModule {}
