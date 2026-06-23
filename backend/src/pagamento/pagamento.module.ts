import { Module } from '@nestjs/common';import { AuthModule } from '../auth/auth.module';import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';import { PagamentoController } from './pagamento.controller';
@Module({imports:[AuthModule,ContextoUsuarioModule],controllers:[PagamentoController]}) export class PagamentoModule{}
