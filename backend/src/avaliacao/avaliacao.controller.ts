import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { ResponderAvaliacaoDto } from './dto/responder-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';

@Controller('api/avaliacoes')
export class AvaliacaoController {
  constructor(private readonly service: AvaliacaoService) {}

  @Post()
  create(@Body() dto: CreateAvaliacaoDto) {
    return this.service.create(dto);
  }

  @Get('usina/:usinaId')
  findByUsina(@Param('usinaId') usinaId: string) {
    return this.service.findByUsina(usinaId);
  }

  @Get('empresa/:empresaId')
  findByEmpresa(@Param('empresaId') empresaId: string) {
    return this.service.findByEmpresa(empresaId);
  }

  @Get('pedido/:pedidoId')
  findByPedido(@Param('pedidoId') pedidoId: string) {
    return this.service.findByPedido(pedidoId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAvaliacaoDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/resposta')
  answer(@Param('id') id: string, @Body() dto: ResponderAvaliacaoDto) {
    return this.service.answer(id, dto);
  }

  @Get('usina/:usinaId/resumo')
  summary(@Param('usinaId') usinaId: string) {
    return this.service.summary(usinaId);
  }
}
