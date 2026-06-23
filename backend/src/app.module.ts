import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { EmpresaModule } from './empresa/empresa.module';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { PedidoModule } from './pedido/pedido.module';
import { PropostaModule } from './proposta/proposta.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { SolicitacaoBloqueioUsinaModule } from './solicitacao-bloqueio-usina/solicitacao-bloqueio-usina.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ContextoUsuarioModule } from './contexto-usuario/contexto-usuario.module';
import { UsinaModule } from './usina/usina.module';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    ContextoUsuarioModule,
    EmpresaModule,
    UsinaModule,
    UsuarioModule,
    FuncionarioModule,
    PedidoModule,
    PropostaModule,
    AvaliacaoModule,
    SolicitacaoBloqueioUsinaModule,
    NotificacaoModule,
    PagamentoModule
  ],
  controllers: [AppController]
})
export class AppModule {}
