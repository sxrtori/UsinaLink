import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      message: 'API UsinaLink NestJS online',
      routes: ['/api/auth/login/empresa', '/api/auth/login/usina', '/api/auth/login/pessoa_fisica', '/api/cadastro/empresa', '/api/cadastro/usina', '/api/cadastro/pessoa_fisica', '/api/empresas', '/api/usinas', '/api/propostas', '/api/funcionarios']
    };
  }
}
