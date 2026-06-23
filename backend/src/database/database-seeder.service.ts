import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { JsonDatabaseService } from './json-database.service';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(private readonly database: JsonDatabaseService) {}

  async onApplicationBootstrap() {
    await Promise.all([
      this.database.findAll('empresas'),
      this.database.findAll('usinas'),
      this.database.findAll('usuarios'),
      this.database.findAll('funcionarios'),
      this.database.findAll('pedidos'),
      this.database.findAll('propostas'),
      this.database.findAll('avaliacoes'),
      this.database.findAll('solicitacoes-bloqueio-usina'),
      this.database.findAll('bloqueios-empresa-usina')
    ]);
    this.logger.log('Persistencia temporaria em JSON carregada.');
  }
}
