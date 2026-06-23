import { Body, Controller, Post } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UsuarioService } from './usuario.service';

@Controller('api')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}
  @Post('auth/login') async login(@Body() dto: LoginDto) { return { message: 'Login realizado com sucesso.', user: await this.service.login(dto) }; }
  @Post('cadastro') async register(@Body() dto: CreateUsuarioDto) { return { message: 'Cadastro realizado com sucesso.', user: await this.service.register(dto) }; }
  @Post('cadastro/empresa') async empresa(@Body() dto: CreateUsuarioDto) { return { message: 'Cadastro realizado com sucesso.', user: await this.service.register(dto, 'empresa') }; }
  @Post('cadastro/usina') async usina(@Body() dto: CreateUsuarioDto) { return { message: 'Cadastro realizado com sucesso.', user: await this.service.register(dto, 'usina') }; }
  @Post('cadastro/pessoa_fisica') async pessoaFisica(@Body() dto: CreateUsuarioDto) { return { message: 'Cadastro realizado com sucesso.', user: await this.service.register(dto, 'pessoa_fisica') }; }
  @Post('cadastro/pessoa-fisica') async pessoaFisicaAlias(@Body() dto: CreateUsuarioDto) { return { message: 'Cadastro realizado com sucesso.', user: await this.service.register(dto, 'pessoa_fisica') }; }
}
