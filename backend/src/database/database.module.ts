import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from '../empresa/empresa.entity';
import { Funcionario } from '../funcionario/funcionario.entity';
import { Pedido } from '../pedido/pedido.entity';
import { Proposta } from '../proposta/proposta.entity';
import { Usina } from '../usina/usina.entity';
import { Usuario } from '../usuario/usuario.entity';
import { DatabaseSeederService } from './database-seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Usina, Usuario, Funcionario, Pedido, Proposta])],
  providers: [DatabaseSeederService]
})
export class DatabaseModule {}
