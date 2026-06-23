import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { EmpresaService } from './empresa.service';

@Controller('api/empresas')
export class EmpresaController {
  constructor(private readonly service: EmpresaService) {}

  @Get('buscar')
  async buscar(@Query('nome') nome?: string, @Query('cnpj') cnpj?: string) {
    const empresa = await this.service.buscar(nome, cnpj);
    if (!empresa) throw new NotFoundException('Empresa nao encontrada. Preencha os dados manualmente.');
    return empresa;
  }
}
