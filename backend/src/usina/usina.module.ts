import { Module } from '@nestjs/common';
import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';
import { UsinaController } from './usina.controller';
import { UsinaService } from './usina.service';
@Module({ imports:[ContextoUsuarioModule], controllers:[UsinaController], providers:[UsinaService] }) export class UsinaModule {}
