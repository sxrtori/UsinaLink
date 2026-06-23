import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

export const JSON_COLLECTIONS = [
  'usuarios','empresas','usinas','pessoas-fisicas','funcionarios','pedidos','propostas','avaliacoes','pagamentos','notificacoes','solicitacoes-bloqueio-usina','bloqueios-usina','historico-status-pedido','itens-pedido','arquivos-pedido','enderecos-empresas','enderecos-usinas','pecas','modelos-contrato'
];

type AnyRecord = Record<string, any>;

@Injectable()
export class JsonDatabaseService implements OnModuleInit {
  private readonly databasePath = path.resolve(process.cwd(), 'database');
  private readonly queues = new Map<string, Promise<unknown>>();

  async onModuleInit() { await this.ensureDatabase(); }

  async ensureDatabase() {
    await fs.mkdir(this.databasePath, { recursive: true });
    await Promise.all(JSON_COLLECTIONS.map(c => this.ensureFile(c)));
  }

  private filePath(collection: string) { return path.join(this.databasePath, `${collection}.json`); }
  private async ensureFile(collection: string) {
    const filePath = this.filePath(collection);
    try { await fs.access(filePath); } catch { await fs.writeFile(filePath, '[]\n', 'utf8'); }
  }

  private async readUnlocked<T>(collection: string): Promise<T[]> {
    await this.ensureFile(collection);
    const filePath = this.filePath(collection);
    const raw = await fs.readFile(filePath, 'utf8');
    if (!raw.trim()) return [];
    try {
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch {
      const backup = `${filePath}.invalid-${Date.now()}.bak`;
      await fs.copyFile(filePath, backup);
      await fs.writeFile(filePath, '[]\n', 'utf8');
      return [];
    }
  }

  private async writeUnlocked<T>(collection: string, data: T[]) {
    await this.ensureFile(collection);
    const filePath = this.filePath(collection);
    const temporaryPath = `${filePath}.tmp`;
    await fs.writeFile(temporaryPath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(temporaryPath, filePath);
  }

  private enqueue<T>(collection: string, fn: () => Promise<T>): Promise<T> {
    const previous = this.queues.get(collection) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(fn);
    this.queues.set(collection, next.catch(() => undefined));
    return next;
  }

  readAll<T>(collection: string): Promise<T[]> { return this.enqueue(collection, () => this.readUnlocked<T>(collection)); }
  async findById<T extends AnyRecord>(collection: string, id: string): Promise<T | null> { return (await this.readAll<T>(collection)).find(i => this.matchesId(i, id)) ?? null; }
  async findOne<T>(collection: string, predicate: (item: T) => boolean): Promise<T | null> { return (await this.readAll<T>(collection)).find(predicate) ?? null; }
  async filter<T>(collection: string, predicate: (item: T) => boolean): Promise<T[]> { return (await this.readAll<T>(collection)).filter(predicate); }
  create<T extends AnyRecord>(collection: string, data: T): Promise<T> { return this.enqueue(collection, async () => { const rows = await this.readUnlocked<T>(collection); const now = new Date().toISOString(); const row: any = { id: randomUUID(), criadoEm: now, atualizadoEm: now, ...data }; rows.push(row); await this.writeUnlocked(collection, rows); return row; }); }
  update<T extends AnyRecord>(collection: string, id: string, changes: Partial<T>): Promise<T> { return this.enqueue(collection, async () => { const rows = await this.readUnlocked<T>(collection); const idx = rows.findIndex(i => this.matchesId(i, id)); if (idx < 0) throw new Error('Registro nao encontrado.'); rows[idx] = { ...rows[idx], ...changes, atualizadoEm: new Date().toISOString() }; await this.writeUnlocked(collection, rows); return rows[idx]; }); }
  delete<T extends AnyRecord>(collection: string, id: string): Promise<void> { return this.enqueue(collection, async () => { const rows = await this.readUnlocked<T>(collection); await this.writeUnlocked(collection, rows.filter(i => !this.matchesId(i, id))); }); }
  replaceAll<T>(collection: string, data: T[]): Promise<void> { return this.enqueue(collection, () => this.writeUnlocked(collection, data)); }
  async transaction(ops: Array<{ collection: string; data: any[] }>) { await Promise.all(ops.map(op => this.replaceAll(op.collection, op.data))); }
  newId() { return randomUUID(); }
  private matchesId(item: AnyRecord, id: string) { const v = String(id); return [item.id,item.idUsuario,item.idEmpresa,item.idUsina,item.idFuncionario,item.idPedido,item.idProposta,item.idAvaliacao,item.idPagamento,item.idNotificacao,item.idSolicitacao,item.idBloqueio].some(x => x !== undefined && String(x) === v); }
}
