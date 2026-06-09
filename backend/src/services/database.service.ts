import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService {
  private readonly databaseDir = path.join(__dirname, '..', '..', 'database');

  private filePath(name: string) {
    return path.join(this.databaseDir, name);
  }

  readJson<T = any[]>(name: string, fallback: T = [] as T): T {
    try {
      return JSON.parse(fs.readFileSync(this.filePath(name), 'utf8'));
    } catch {
      return fallback;
    }
  }

  writeJson(name: string, data: unknown) {
    fs.writeFileSync(this.filePath(name), `${JSON.stringify(data, null, 2)}\n`);
  }

  getUsuarios() {
    return this.readJson('usuarios.json');
  }

  salvarUsuarios(data: unknown[]) {
    this.writeJson('usuarios.json', data);
  }

  getEmpresas() {
    return this.readJson('empresas.json');
  }

  salvarEmpresas(data: unknown[]) {
    this.writeJson('empresas.json', data);
  }

  getUsinas() {
    return this.readJson('usinas.json');
  }

  salvarUsinas(data: unknown[]) {
    this.writeJson('usinas.json', data);
  }

  getPessoasFisicas() {
    return this.readJson('pessoas-fisicas.json');
  }

  salvarPessoasFisicas(data: unknown[]) {
    this.writeJson('pessoas-fisicas.json', data);
  }

  getPropostas() {
    return this.readJson('propostas.json');
  }

  salvarPropostas(data: unknown[]) {
    this.writeJson('propostas.json', data);
  }

  getFuncionarios() {
    return this.readJson('funcionarios.json');
  }

  salvarFuncionarios(data: unknown[]) {
    this.writeJson('funcionarios.json', data);
  }

  getPedidos() {
    return this.readJson('pedidos.json');
  }
}
