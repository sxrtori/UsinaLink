import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'API UsinaLink NestJS online',
      routes: ['/api/auth/login/empresa', '/api/auth/login/usina', '/api/cadastro/empresa', '/api/cadastro/usina', '/api/empresas', '/api/usinas', '/api/propostas', '/api/funcionarios']
    };
  }
}
