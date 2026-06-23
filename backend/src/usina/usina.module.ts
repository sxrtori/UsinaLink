import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqueioUsina, EnderecoUsina, Funcionario, Notificacao, Pedido, Proposta, Usina } from '../common/entities/core.entities';
import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';
import { UsinaController } from './usina.controller';
import { UsinaService } from './usina.service';
@Module({ imports:[TypeOrmModule.forFeature([Usina, EnderecoUsina, Funcionario, Proposta, BloqueioUsina, Pedido, Notificacao]), ContextoUsuarioModule], controllers:[UsinaController], providers:[UsinaService] }) export class UsinaModule {}
