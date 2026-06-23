import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Funcionario } from '../funcionario/funcionario.entity';
import { Pedido } from '../pedido/pedido.entity';
import { Proposta } from '../proposta/proposta.entity';
import { Usina } from '../usina/usina.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);
  private readonly dataDir = join(__dirname, '..', '..', 'database');

  constructor(
    @InjectRepository(Empresa) private readonly empresas: Repository<Empresa>,
    @InjectRepository(Usina) private readonly usinas: Repository<Usina>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Funcionario) private readonly funcionarios: Repository<Funcionario>,
    @InjectRepository(Pedido) private readonly pedidos: Repository<Pedido>,
    @InjectRepository(Proposta) private readonly propostas: Repository<Proposta>
  ) {}

  async onApplicationBootstrap() {
    await this.seed(this.empresas, 'empresas.json');
    await this.seed(this.usinas, 'usinas.json');
    await this.seed(this.usuarios, 'usuarios.json');
    await this.seed(this.funcionarios, 'funcionarios.json');
    await this.seed(this.pedidos, 'pedidos.json');
    await this.seed(this.propostas, 'propostas.json');
  }

  private async seed<T extends object>(repository: Repository<T>, file: string) {
    if (await repository.count()) return;
    const rows = JSON.parse(await readFile(join(this.dataDir, file), 'utf8')) as T[];
    if (!rows.length) return;
    await repository.save(rows.map(row => repository.create(row)));
    this.logger.log(`${rows.length} registros importados para ${repository.metadata.tableName}.`);
  }
}
