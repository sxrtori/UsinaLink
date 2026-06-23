import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { UsinaService } from './usina.service';

@Controller('api/usinas')
export class UsinaController {
  constructor(private readonly service: UsinaService) {}
  @Get('buscar')
  async buscar(@Query('nome') nome?: string, @Query('cnpj') cnpj?: string) {
    const usina = await this.service.buscar(nome, cnpj);
    if (!usina) throw new NotFoundException('Usina nao encontrada. Preencha os dados manualmente.');
    return usina;
  }
}
