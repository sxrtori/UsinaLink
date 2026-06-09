import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AuthController } from './controllers/auth.controller';
import { CadastroController } from './controllers/cadastro.controller';
import { LookupController } from './controllers/lookup.controller';
import { PropostasController } from './controllers/propostas.controller';
import { FuncionariosController } from './controllers/funcionarios.controller';
import { PedidosController } from './controllers/pedidos.controller';
import { DatabaseService } from './services/database.service';
import { CnpjService } from './services/cnpj.service';

@Module({
  controllers: [
    AppController,
    AuthController,
    CadastroController,
    LookupController,
    PropostasController,
    FuncionariosController,
    PedidosController
  ],
  providers: [DatabaseService, CnpjService]
})
export class AppModule {}
