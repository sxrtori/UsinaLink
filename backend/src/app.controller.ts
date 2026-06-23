import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'API UsinaLink NestJS online',
      routes: ['/api/auth/login', '/api/cadastro', '/api/empresas', '/api/usinas', '/api/propostas', '/api/funcionarios']
    };
  }
}
