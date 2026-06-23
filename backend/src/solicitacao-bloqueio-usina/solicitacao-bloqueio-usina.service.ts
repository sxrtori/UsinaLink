import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDatabaseService } from '../database/json-database.service';
import { Pedido } from '../pedido/pedido.entity';
import { Proposta } from '../proposta/proposta.entity';
import { BloqueioEmpresaUsina } from './bloqueio-empresa-usina.entity';
import { CreateSolicitacaoBloqueioUsinaDto } from './dto/create-solicitacao-bloqueio-usina.dto';
import { UpdateStatusSolicitacaoBloqueioDto } from './dto/update-status-solicitacao-bloqueio.dto';
import { SolicitacaoBloqueioStatus, SolicitacaoBloqueioUsina } from './solicitacao-bloqueio-usina.entity';

const statuses: SolicitacaoBloqueioStatus[] = ['pendente', 'em_analise', 'aprovada', 'rejeitada', 'cancelada'];
const reasons = ['Descumprimento de prazo', 'Problema de qualidade', 'Tentativa de fraude', 'Comunicacao inadequada', 'Descumprimento comercial', 'Outro'];

@Injectable()
export class SolicitacaoBloqueioUsinaService {
  constructor(private readonly database: JsonDatabaseService) {}

  async create(dto: CreateSolicitacaoBloqueioUsinaDto) {
    if (!dto.empresaId || !dto.usinaId) throw new BadRequestException('empresaId e usinaId sao obrigatorios.');
    if (!reasons.includes(dto.motivo)) throw new BadRequestException('Motivo de bloqueio invalido.');
    const description = String(dto.descricao || '').trim();
    if (description.length < 20 || description.length > 1000) throw new BadRequestException('Descricao deve ter entre 20 e 1000 caracteres.');

    if (dto.pedidoId) {
      const pedido = await this.database.findOne<Pedido>('pedidos', row => row.id === dto.pedidoId);
      if (!pedido) throw new NotFoundException('Pedido informado nao encontrado.');
      if (pedido.empresaId !== dto.empresaId) throw new ForbiddenException('Pedido nao pertence a empresa informada.');
      const proposta = await this.database.findOne<Proposta>('propostas', row => row.pedidoId === dto.pedidoId && row.usinaId === dto.usinaId);
      if (!proposta) throw new BadRequestException('A usina informada nao esta relacionada ao pedido.');
    }

    const duplicate = await this.database.findOne<SolicitacaoBloqueioUsina>(
      'solicitacoes-bloqueio-usina',
      row => row.empresaId === dto.empresaId && row.usinaId === dto.usinaId && ['pendente', 'em_analise'].includes(row.status)
    );
    if (duplicate) throw new BadRequestException('Ja existe uma solicitacao pendente para esta empresa e usina.');

    const now = new Date().toISOString();
    const request: SolicitacaoBloqueioUsina = {
      id: `bloqueio-solicitacao-${randomUUID()}`,
      empresaId: dto.empresaId,
      usinaId: dto.usinaId,
      pedidoId: dto.pedidoId || null,
      motivo: dto.motivo,
      descricao: description,
      status: 'pendente',
      criadoEm: now,
      atualizadoEm: now
    };

    return this.database.insert<SolicitacaoBloqueioUsina>('solicitacoes-bloqueio-usina', request);
  }

  findAll() {
    return this.database.findAll<SolicitacaoBloqueioUsina>('solicitacoes-bloqueio-usina');
  }

  async findMine(empresaId?: string) {
    if (!empresaId) throw new BadRequestException('empresaId e obrigatorio.');
    const rows = await this.findAll();
    return rows.filter(row => row.empresaId === empresaId);
  }

  async findOne(id: string) {
    const request = await this.database.findOne<SolicitacaoBloqueioUsina>('solicitacoes-bloqueio-usina', row => row.id === id);
    if (!request) throw new NotFoundException('Solicitacao de bloqueio nao encontrada.');
    return request;
  }

  async cancel(id: string, empresaId?: string) {
    const request = await this.findOne(id);
    if (empresaId && request.empresaId !== empresaId) throw new ForbiddenException('Empresa nao autorizada a cancelar esta solicitacao.');
    if (request.status !== 'pendente') throw new BadRequestException('Somente solicitacoes pendentes podem ser canceladas pela empresa.');
    return this.database.update<SolicitacaoBloqueioUsina>('solicitacoes-bloqueio-usina', id, {
      status: 'cancelada',
      atualizadoEm: new Date().toISOString()
    });
  }

  async updateStatus(id: string, dto: UpdateStatusSolicitacaoBloqueioDto) {
    if (!statuses.includes(dto.status)) throw new BadRequestException('Status invalido.');
    const request = await this.findOne(id);
    const now = new Date().toISOString();
    const updated = await this.database.update<SolicitacaoBloqueioUsina>('solicitacoes-bloqueio-usina', id, {
      status: dto.status,
      respostaModeracao: dto.respostaModeracao,
      analisadoPor: dto.analisadoPor,
      analisadoEm: ['aprovada', 'rejeitada'].includes(dto.status) ? now : request.analisadoEm,
      atualizadoEm: now
    });

    if (dto.status === 'aprovada') await this.ensureActiveBlock(request, id);
    return updated;
  }

  async isBlocked(empresaId: string, usinaId: string) {
    const block = await this.database.findOne<BloqueioEmpresaUsina>(
      'bloqueios-empresa-usina',
      row => row.empresaId === empresaId && row.usinaId === usinaId && row.ativo
    );
    return Boolean(block);
  }

  private async ensureActiveBlock(request: SolicitacaoBloqueioUsina, solicitacaoId: string) {
    const existing = await this.database.findOne<BloqueioEmpresaUsina>(
      'bloqueios-empresa-usina',
      row => row.empresaId === request.empresaId && row.usinaId === request.usinaId && row.ativo
    );
    if (existing) return existing;

    return this.database.insert<BloqueioEmpresaUsina>('bloqueios-empresa-usina', {
      id: `bloqueio-${randomUUID()}`,
      empresaId: request.empresaId,
      usinaId: request.usinaId,
      solicitacaoId,
      ativo: true,
      criadoEm: new Date().toISOString()
    });
  }
}
