import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../services/database.service';

@Controller('api/propostas')
export class PropostasController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  list() {
    return this.db.getPropostas().filter((item: any) => item.status !== 'Cancelada');
  }

  @Post()
  create(@Body() body: any) {
    const propostas = this.db.getPropostas();
    const pedidoId = body.pedidoId || body.solicitacaoId || 'pedido-1';
    const pedido = this.db.getPedidos().find((item: any) => item.id === pedidoId);
    if (!pedido) throw new HttpException({ message: 'Pedido nao encontrado.' }, HttpStatus.NOT_FOUND);
    if (!body.usinaId) throw new HttpException({ message: 'usinaId e obrigatorio.' }, HttpStatus.BAD_REQUEST);
    if (!body.valor || !body.prazo) throw new HttpException({ message: 'Valor e prazo sao obrigatorios.' }, HttpStatus.BAD_REQUEST);

    const proposta = {
      id: `proposta-${randomUUID()}`,
      pedidoId,
      solicitacaoId: pedidoId,
      usinaId: body.usinaId,
      empresaId: body.empresaId || pedido.empresaId,
      usina: body.usina || 'Usina',
      cliente: body.cliente || pedido.empresa,
      peca: body.peca || pedido.peca,
      valor: body.valor,
      prazo: body.prazo,
      frete: body.frete || 'R$ 0,00',
      avaliacao: body.avaliacao || '4,9/5',
      observacao: body.observacao || '',
      material: pedido.material,
      quantidade: pedido.quantidade,
      regiao: pedido.regiao,
      arquivo: pedido.arquivo,
      status: 'Enviada',
      dataEnvio: new Date().toLocaleDateString('pt-BR')
    };
    propostas.push(proposta);
    this.db.salvarPropostas(propostas);
    return { message: 'Proposta enviada com sucesso.', proposta };
  }

  @Get('usina/:usinaId')
  listByUsina(@Param('usinaId') usinaId: string) {
    return this.db.getPropostas().filter((item: any) => item.usinaId === usinaId && item.status !== 'Cancelada');
  }

  @Get('empresa/:empresaId')
  listByEmpresa(@Param('empresaId') empresaId: string) {
    return this.db.getPropostas().filter((item: any) => item.empresaId === empresaId && item.status !== 'Cancelada');
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const propostas = this.db.getPropostas();
    const index = propostas.findIndex((item: any) => item.id === id);
    if (index === -1) throw new HttpException({ message: 'Proposta nao encontrada.' }, HttpStatus.NOT_FOUND);
    propostas[index] = { ...propostas[index], ...body };
    this.db.salvarPropostas(propostas);
    return { message: 'Proposta atualizada.', proposta: propostas[index] };
  }

  @Put(':id/cancelar')
  cancel(@Param('id') id: string) {
    return this.update(id, { status: 'Cancelada' });
  }

  @Put(':id/aceitar')
  accept(@Param('id') id: string) {
    return this.update(id, { status: 'Aceita' });
  }
}
