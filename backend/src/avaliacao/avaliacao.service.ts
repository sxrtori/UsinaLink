import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDatabaseService } from '../database/json-database.service';
import { Pedido } from '../pedido/pedido.entity';
import { Proposta } from '../proposta/proposta.entity';
import { Avaliacao } from './avaliacao.entity';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { ResponderAvaliacaoDto } from './dto/responder-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

const acceptedStatuses = ['aceita', 'aceito', 'proposta aceita'];
const finishedStatuses = ['concluido', 'concluida', 'concluído', 'concluída', 'finalizado', 'finalizada'];

function normalize(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function rating(value: unknown, field: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    throw new BadRequestException(`${field} deve ser uma nota inteira de 1 a 5.`);
  }
  return number;
}

@Injectable()
export class AvaliacaoService {
  constructor(private readonly database: JsonDatabaseService) {}

  async create(dto: CreateAvaliacaoDto) {
    if (!dto.pedidoId) throw new BadRequestException('pedidoId e obrigatorio.');

    const pedido = await this.database.findOne<Pedido>('pedidos', item => item.id === dto.pedidoId);
    if (!pedido) throw new NotFoundException('Pedido nao encontrado.');

    const propostas = await this.database.findAll<Proposta>('propostas');
    const propostaAceita = propostas.find(proposta => proposta.pedidoId === pedido.id && acceptedStatuses.includes(normalize(proposta.status)));
    if (!propostaAceita) throw new BadRequestException('Avaliacao permitida apenas quando existir uma proposta aceita.');

    if (!finishedStatuses.includes(normalize(pedido.status))) {
      throw new BadRequestException('Avaliacao permitida apenas para pedidos concluidos.');
    }

    const duplicate = await this.database.findOne<Avaliacao>('avaliacoes', item => item.pedidoId === pedido.id && item.empresaId === pedido.empresaId);
    if (duplicate) throw new BadRequestException('Este pedido ja possui uma avaliacao da empresa.');

    const now = new Date().toISOString();
    const avaliacao: Avaliacao = {
      id: `avaliacao-${randomUUID()}`,
      pedidoId: pedido.id,
      empresaId: pedido.empresaId,
      usinaId: propostaAceita.usinaId,
      notaGeral: rating(dto.notaGeral, 'notaGeral'),
      qualidade: rating(dto.qualidade, 'qualidade'),
      prazo: rating(dto.prazo, 'prazo'),
      comunicacao: rating(dto.comunicacao, 'comunicacao'),
      comentario: String(dto.comentario || '').trim(),
      criadoEm: now,
      atualizadoEm: now
    };

    return this.database.insert<Avaliacao>('avaliacoes', avaliacao);
  }

  findByUsina(usinaId: string) {
    return this.database.findAll<Avaliacao>('avaliacoes').then(rows => rows.filter(row => row.usinaId === usinaId));
  }

  findByEmpresa(empresaId: string) {
    return this.database.findAll<Avaliacao>('avaliacoes').then(rows => rows.filter(row => row.empresaId === empresaId));
  }

  findByPedido(pedidoId: string) {
    return this.database.findOne<Avaliacao>('avaliacoes', row => row.pedidoId === pedidoId);
  }

  async update(id: string, dto: UpdateAvaliacaoDto) {
    const avaliacao = await this.database.findOne<Avaliacao>('avaliacoes', row => row.id === id);
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (dto.empresaId && dto.empresaId !== avaliacao.empresaId) throw new ForbiddenException('Empresa nao autorizada a alterar esta avaliacao.');

    const created = new Date(avaliacao.criadoEm).getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Number.isFinite(created) && Date.now() - created > sevenDays) {
      throw new ForbiddenException('Prazo para editar a avaliacao encerrado.');
    }

    const changes: Partial<Avaliacao> = {
      atualizadoEm: new Date().toISOString()
    };
    if (dto.notaGeral !== undefined) changes.notaGeral = rating(dto.notaGeral, 'notaGeral');
    if (dto.qualidade !== undefined) changes.qualidade = rating(dto.qualidade, 'qualidade');
    if (dto.prazo !== undefined) changes.prazo = rating(dto.prazo, 'prazo');
    if (dto.comunicacao !== undefined) changes.comunicacao = rating(dto.comunicacao, 'comunicacao');
    if (dto.comentario !== undefined) changes.comentario = String(dto.comentario || '').trim();

    return this.database.update<Avaliacao>('avaliacoes', id, changes);
  }

  async answer(id: string, dto: ResponderAvaliacaoDto) {
    const avaliacao = await this.database.findOne<Avaliacao>('avaliacoes', row => row.id === id);
    if (!avaliacao) throw new NotFoundException('Avaliacao nao encontrada.');
    if (dto.usinaId && dto.usinaId !== avaliacao.usinaId) throw new ForbiddenException('Usina nao autorizada a responder esta avaliacao.');
    if (!String(dto.respostaDaUsina || '').trim()) throw new BadRequestException('Resposta da usina e obrigatoria.');

    return this.database.update<Avaliacao>('avaliacoes', id, {
      respostaDaUsina: String(dto.respostaDaUsina || '').trim(),
      atualizadoEm: new Date().toISOString()
    });
  }

  async summary(usinaId: string) {
    const rows = await this.findByUsina(usinaId);
    const count = rows.length;
    const average = (field: keyof Pick<Avaliacao, 'notaGeral' | 'qualidade' | 'prazo' | 'comunicacao'>) =>
      count ? Number((rows.reduce((sum, row) => sum + Number(row[field] || 0), 0) / count).toFixed(1)) : 0;
    const distribution = [1, 2, 3, 4, 5].reduce((acc, note) => ({ ...acc, [note]: rows.filter(row => row.notaGeral === note).length }), {});

    return {
      usinaId,
      quantidade: count,
      mediaGeral: average('notaGeral'),
      mediaQualidade: average('qualidade'),
      mediaPrazo: average('prazo'),
      mediaComunicacao: average('comunicacao'),
      distribuicao: distribution,
      ultimas: rows.slice(-5).reverse()
    };
  }
}
