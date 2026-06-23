import { Module } from '@nestjs/common';import { AuthModule } from '../auth/auth.module';import { NotificacaoController } from './notificacao.controller';
@Module({imports:[AuthModule],controllers:[NotificacaoController]}) export class NotificacaoModule{}
