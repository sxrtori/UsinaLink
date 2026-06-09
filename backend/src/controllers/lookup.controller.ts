import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CnpjService } from '../services/cnpj.service';

@Controller()
export class LookupController {
  constructor(private readonly cnpjService: CnpjService) {}

  @Get('api/empresas/buscar')
  buscarEmpresa(@Query('nome') nome?: string, @Query('cnpj') cnpj?: string) {
    const result = cnpj ? this.cnpjService.buscarPorCnpj(cnpj, 'empresa') : this.cnpjService.buscarPorNome(nome || '', 'empresa');
    if (!result) throw new HttpException({ message: 'Empresa nao encontrada. Preencha os dados manualmente.' }, HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('api/usinas/buscar')
  buscarUsina(@Query('nome') nome?: string, @Query('cnpj') cnpj?: string) {
    const result = cnpj ? this.cnpjService.buscarPorCnpj(cnpj, 'usina') : this.cnpjService.buscarPorNome(nome || '', 'usina');
    if (!result) throw new HttpException({ message: 'Usina nao encontrada. Preencha os dados manualmente.' }, HttpStatus.NOT_FOUND);
    return result;
  }
}
