import { Module } from '@nestjs/common';
import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
@Module({ imports:[ContextoUsuarioModule], controllers:[EmpresaController], providers:[EmpresaService] }) export class EmpresaModule {}
