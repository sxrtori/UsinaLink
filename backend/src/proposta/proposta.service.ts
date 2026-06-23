import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDatabaseService } from '../database/json-database.service';
import { PedidoService } from '../pedido/pedido.service';
import { SolicitacaoBloqueioUsinaService } from '../solicitacao-bloqueio-usina/solicitacao-bloqueio-usina.service';
import { CreatePropostaDto } from './dto/create-proposta.dto';
import { UpdatePropostaDto } from './dto/update-proposta.dto';
import { Proposta } from './proposta.entity';

@Injectable()
export class PropostaService {
  constructor(
    private readonly database: JsonDatabaseService,
    private readonly pedidos: PedidoService,
    private readonly bloqueios: SolicitacaoBloqueioUsinaService
  ) {}

  async findAll() {
    const propostas = await this.database.findAll<Proposta>('propostas');
    return propostas.filter(proposta => proposta.status !== 'Cancelada');
  }

  async findByUsina(usinaId: string) {
    const propostas = await this.findAll();
    return propostas.filter(proposta => proposta.usinaId === usinaId);
  }

  async findByEmpresa(empresaId: string) {
    const propostas = await this.findAll();
    return propostas.filter(proposta => proposta.empresaId === empresaId);
  }

  async create(dto: CreatePropostaDto) {
    const pedidoId = dto.pedidoId || dto.solicitacaoId || 'pedido-1';
    const pedido = await this.pedidos.findOne(pedidoId);
    if (!pedido) throw new NotFoundException('Pedido nao encontrado.');
    if (!dto.usinaId) throw new BadRequestException('usinaId e obrigatorio.');
    if (!dto.valor || !dto.prazo) throw new BadRequestException('Valor e prazo sao obrigatorios.');
    if (await this.bloqueios.isBlocked(pedido.empresaId, dto.usinaId)) {
      throw new ForbiddenException('Novas interacoes comerciais entre esta empresa e usina estao bloqueadas.');
    }
    const proposta = {
      ...dto, id: `proposta-${randomUUID()}`, pedidoId, solicitacaoId: pedidoId,
      empresaId: dto.empresaId || pedido.empresaId, usina: dto.usina || 'Usina',
      cliente: dto.cliente || pedido.empresa, peca: dto.peca || pedido.peca,
      frete: dto.frete || 'R$ 0,00', avaliacao: dto.avaliacao || '4,9/5', observacao: dto.observacao || '',
      material: pedido.material, quantidade: pedido.quantidade, regiao: pedido.regiao, arquivo: pedido.arquivo,
      status: 'Enviada', dataEnvio: new Date().toLocaleDateString('pt-BR')
    } as Proposta;
    return this.database.insert<Proposta>('propostas', proposta);
  }

  async update(id: string, dto: UpdatePropostaDto) {
    const proposta = await this.database.update<Proposta>('propostas', id, dto);
    if (!proposta) throw new NotFoundException('Proposta nao encontrada.');
    return proposta;
  }
}
