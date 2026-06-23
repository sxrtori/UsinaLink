import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa, EnderecoEmpresa, Funcionario, Notificacao, Pagamento, Pedido, Proposta, SolicitacaoBloqueioUsina } from '../common/entities/core.entities';
import { ContextoUsuarioModule } from '../contexto-usuario/contexto-usuario.module';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
@Module({ imports:[TypeOrmModule.forFeature([Empresa, EnderecoEmpresa, Funcionario, Pedido, Proposta, Pagamento, SolicitacaoBloqueioUsina, Notificacao]), ContextoUsuarioModule], controllers:[EmpresaController], providers:[EmpresaService] }) export class EmpresaModule {}
