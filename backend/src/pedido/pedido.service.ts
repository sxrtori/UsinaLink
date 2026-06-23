import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextoUsuarioService } from '../contexto-usuario/contexto-usuario.service';
import { Pedido, Proposta, Empresa, HistoricoStatusPedido } from '../common/entities/core.entities';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido) private pedidoRepo: Repository<Pedido>,
    @InjectRepository(Proposta) private propostaRepo: Repository<Proposta>,
    @InjectRepository(Empresa) private empresaRepo: Repository<Empresa>,
    @InjectRepository(HistoricoStatusPedido) private historicoRepo: Repository<HistoricoStatusPedido>,
    private ctx: ContextoUsuarioService
  ) {}

  private async enrich(p: Pedido) {
    const propostas = await this.propostaRepo.find({ where: { idPedido: p.idPedido } });
    const empresaCompradora = await this.empresaRepo.findOne({ where: { idEmpresa: p.idEmpresaCompradora } });
    return { ...p, propostas, empresaCompradora, itens: (p as any).itens || [], arquivos: (p as any).arquivos || [] };
  }

  async criar(dto: any, user: any) {
    const idEmpresa = await this.ctx.obterEmpresaId(user.sub);
    const pedido = this.pedidoRepo.create({
      idEmpresaCompradora: idEmpresa,
      idUsuarioSolicitante: user.sub,
      numeroPedido: dto.numeroPedido || `PED-${Date.now()}`,
      urgencia: dto.urgencia,
      status: 'aberto',
      observacoes: dto.observacoes || dto.descricao,
      prazoEntregaDias: dto.prazoEntregaDias || dto.prazo,
      dataPedido: new Date(),
      itens: dto.itens || [{ nome: dto.peca, categoria: dto.categoria, material: dto.material, quantidade: dto.quantidade }],
      arquivos: dto.arquivos || []
    });

    const savedPedido = await this.pedidoRepo.save(pedido);

    await this.historicoRepo.create({
      idPedido: savedPedido.idPedido,
      statusNovo: 'aberto',
      idUsuarioResponsavel: user.sub,
      observacao: 'Pedido criado'
    });

    return savedPedido;
  }

  async meus(user: any) {
    const idEmpresa = await this.ctx.obterEmpresaId(user.sub);
    const pedidos = await this.pedidoRepo.find({ where: { idEmpresaCompradora: idEmpresa } });
    return Promise.all(pedidos.map(p => this.enrich(p)));
  }

  async disponiveis() {
    const pedidos = await this.pedidoRepo.find({ 
      where: { status: ['aberto', 'em_negociacao'] as any } 
    });
    return Promise.all(pedidos.map(p => this.enrich(p)));
  }

  async detalhe(id: any, user: any) {
    const pedido = await this.pedidoRepo.findOne({ where: { idPedido: Number(id) } });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    const enrichedPedido = await this.enrich(pedido);

    if (user.tipoUsuario?.includes('empresa')) {
      if (pedido.idEmpresaCompradora !== await this.ctx.obterEmpresaId(user.sub)) {
        throw new ForbiddenException();
      }
    } else {
      const idUsina = await this.ctx.obterUsinaId(user.sub);
      if (!['aberto', 'em_negociacao'].includes(pedido.status) && 
          !enrichedPedido.propostas?.some((x: any) => x.idUsina === idUsina)) {
        throw new ForbiddenException();
      }
    }

    return enrichedPedido;
  }

  async atualizar(id: any, dto: any, user: any) {
    await this.detalhe(id, user);
    await this.pedidoRepo.update(Number(id), dto);
    return this.detalhe(id, user);
  }

  async cancelar(id: any, user: any) {
    await this.detalhe(id, user);
    await this.pedidoRepo.update(Number(id), { status: 'cancelado' });
    return this.detalhe(id, user);
  }
}
