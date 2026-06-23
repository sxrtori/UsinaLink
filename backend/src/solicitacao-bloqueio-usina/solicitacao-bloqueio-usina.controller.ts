import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSolicitacaoBloqueioUsinaDto } from './dto/create-solicitacao-bloqueio-usina.dto';
import { UpdateStatusSolicitacaoBloqueioDto } from './dto/update-status-solicitacao-bloqueio.dto';
import { SolicitacaoBloqueioUsinaService } from './solicitacao-bloqueio-usina.service';

@Controller('api/solicitacoes-bloqueio-usina')
export class SolicitacaoBloqueioUsinaController {
  constructor(private readonly service: SolicitacaoBloqueioUsinaService) {}

  @Post()
  create(@Body() dto: CreateSolicitacaoBloqueioUsinaDto) {
    return this.service.create(dto);
  }

  @Get('minhas')
  mine(@Query('empresaId') empresaId?: string) {
    return this.service.findMine(empresaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/cancelar')
  cancel(@Param('id') id: string, @Body('empresaId') empresaId?: string) {
    return this.service.cancel(id, empresaId);
  }

  @Get('/admin/todas')
  adminFindAll() {
    return this.service.findAll();
  }

  @Patch('/admin/:id/status')
  adminUpdateStatus(@Param('id') id: string, @Body() dto: UpdateStatusSolicitacaoBloqueioDto) {
    return this.service.updateStatus(id, dto);
  }
}
