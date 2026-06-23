import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UsuarioService } from './usuario.service';
@Controller('api')
export class UsuarioController { constructor(private readonly service:UsuarioService){}
@Post('auth/login/empresa') loginEmpresa(@Body() dto:LoginDto){return this.service.loginArea(dto,'empresa')}
@Post('auth/login/usina') loginUsina(@Body() dto:LoginDto){return this.service.loginArea(dto,'usina')}
@Post('auth/login') login(@Body() dto:LoginDto){return this.service.loginArea(dto,(dto as any).tipo==='usina'?'usina':'empresa')}
@Post('cadastro/empresa') empresa(@Body() dto:CreateUsuarioDto){return this.service.cadastrar(dto,'empresa')}
@Post('cadastro/usina') usina(@Body() dto:CreateUsuarioDto){return this.service.cadastrar(dto,'usina')}
@Get('usuarios/:id') porId(@Param('id') id:string){return this.service.buscarPorId(+id)}
@Get('usuarios') listar(@Query('tipo') tipo?:string,@Query('status') status?:string){return tipo?this.service.buscarPorTipo(tipo):status?this.service.buscarPorStatus(status):[]}
}
