import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Not, Repository } from 'typeorm';
import { PedidoService } from '../pedido/pedido.service';
import { CreatePropostaDto } from './dto/create-proposta.dto';
import { UpdatePropostaDto } from './dto/update-proposta.dto';
import { Proposta } from './proposta.entity';

@Injectable()
export class PropostaService {
  constructor(@InjectRepository(Proposta) private readonly repository: Repository<Proposta>, private readonly pedidos: PedidoService) {}
  findAll() { return this.repository.findBy({ status: Not('Cancelada') }); }
  findByUsina(usinaId: string) { return this.repository.findBy({ usinaId, status: Not('Cancelada') }); }
  findByEmpresa(empresaId: string) { return this.repository.findBy({ empresaId, status: Not('Cancelada') }); }

  async create(dto: CreatePropostaDto) {
    const pedidoId = dto.pedidoId || dto.solicitacaoId || 'pedido-1';
    const pedido = await this.pedidos.findOne(pedidoId);
    if (!pedido) throw new NotFoundException('Pedido nao encontrado.');
    if (!dto.usinaId) throw new BadRequestException('usinaId e obrigatorio.');
    if (!dto.valor || !dto.prazo) throw new BadRequestException('Valor e prazo sao obrigatorios.');
    const proposta = this.repository.create({
      ...dto, id: `proposta-${randomUUID()}`, pedidoId, solicitacaoId: pedidoId,
      empresaId: dto.empresaId || pedido.empresaId, usina: dto.usina || 'Usina',
      cliente: dto.cliente || pedido.empresa, peca: dto.peca || pedido.peca,
      frete: dto.frete || 'R$ 0,00', avaliacao: dto.avaliacao || '4,9/5', observacao: dto.observacao || '',
      material: pedido.material, quantidade: pedido.quantidade, regiao: pedido.regiao, arquivo: pedido.arquivo,
      status: 'Enviada', dataEnvio: new Date().toLocaleDateString('pt-BR')
    });
    return this.repository.save(proposta);
  }

  async update(id: string, dto: UpdatePropostaDto) {
    const proposta = await this.repository.findOneBy({ id });
    if (!proposta) throw new NotFoundException('Proposta nao encontrada.');
    return this.repository.save(this.repository.merge(proposta, dto));
  }
}
