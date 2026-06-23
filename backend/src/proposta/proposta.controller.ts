import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePropostaDto } from './dto/create-proposta.dto';
import { UpdatePropostaDto } from './dto/update-proposta.dto';
import { PropostaService } from './proposta.service';

@Controller('api/propostas')
export class PropostaController {
  constructor(private readonly service: PropostaService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() async create(@Body() dto: CreatePropostaDto) { return { message: 'Proposta enviada com sucesso.', proposta: await this.service.create(dto) }; }
  @Get('usina/:usinaId') findByUsina(@Param('usinaId') id: string) { return this.service.findByUsina(id); }
  @Get('empresa/:empresaId') findByEmpresa(@Param('empresaId') id: string) { return this.service.findByEmpresa(id); }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: UpdatePropostaDto) { return { message: 'Proposta atualizada.', proposta: await this.service.update(id, dto) }; }
  @Put(':id/cancelar') async cancel(@Param('id') id: string) { return { message: 'Proposta atualizada.', proposta: await this.service.update(id, { status: 'Cancelada' }) }; }
  @Put(':id/aceitar') async accept(@Param('id') id: string) { return { message: 'Proposta atualizada.', proposta: await this.service.update(id, { status: 'Aceita' }) }; }
}
