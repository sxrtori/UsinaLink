import { Injectable, Logger } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

type Collection =
  | 'empresas'
  | 'usinas'
  | 'usuarios'
  | 'funcionarios'
  | 'pedidos'
  | 'propostas'
  | 'pessoas-fisicas'
  | 'avaliacoes'
  | 'solicitacoes-bloqueio-usina'
  | 'bloqueios-empresa-usina';

@Injectable()
export class JsonDatabaseService {
  private readonly logger = new Logger(JsonDatabaseService.name);
  private readonly dataDir = join(__dirname, '..', '..', 'database');
  private readonly cache = new Map<Collection, unknown[]>();

  async findAll<T>(collection: Collection): Promise<T[]> {
    return [...await this.load<T>(collection)];
  }

  async findOne<T>(collection: Collection, predicate: (row: T) => boolean): Promise<T | null> {
    return (await this.load<T>(collection)).find(predicate) || null;
  }

  async insert<T extends { id: string }>(collection: Collection, row: T): Promise<T> {
    const rows = await this.load<T>(collection);
    rows.push(row);
    await this.persist(collection, rows);
    return row;
  }

  async update<T extends { id: string }>(collection: Collection, id: string, changes: Partial<T>): Promise<T | null> {
    const rows = await this.load<T>(collection);
    const index = rows.findIndex(row => row.id === id);
    if (index < 0) return null;
    rows[index] = { ...rows[index], ...changes };
    await this.persist(collection, rows);
    return rows[index];
  }

  async updateWhere<T extends { id: string }>(
    collection: Collection,
    predicate: (row: T) => boolean,
    changes: Partial<T>
  ): Promise<T | null> {
    const rows = await this.load<T>(collection);
    const index = rows.findIndex(predicate);
    if (index < 0) return null;
    rows[index] = { ...rows[index], ...changes };
    await this.persist(collection, rows);
    return rows[index];
  }

  async removeWhere<T>(collection: Collection, predicate: (row: T) => boolean): Promise<T | null> {
    const rows = await this.load<T>(collection);
    const index = rows.findIndex(predicate);
    if (index < 0) return null;
    const [removed] = rows.splice(index, 1);
    await this.persist(collection, rows);
    return removed;
  }

  private async load<T>(collection: Collection): Promise<T[]> {
    if (this.cache.has(collection)) return this.cache.get(collection) as T[];

    try {
      const content = await readFile(this.filePath(collection), 'utf8');
      const rows = JSON.parse(content) as T[];
      this.cache.set(collection, rows);
      return rows;
    } catch {
      this.logger.warn(`Arquivo ${collection}.json nao encontrado. Iniciando colecao vazia.`);
      const rows: T[] = [];
      this.cache.set(collection, rows);
      await this.persist(collection, rows);
      return rows;
    }
  }

  private async persist<T>(collection: Collection, rows: T[]) {
    this.cache.set(collection, rows);
    await writeFile(this.filePath(collection), `${JSON.stringify(rows, null, 2)}\n`, 'utf8');
  }

  private filePath(collection: Collection) {
    return join(this.dataDir, `${collection}.json`);
  }
}
