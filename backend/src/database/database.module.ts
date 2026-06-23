import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedDemoService } from './seed-demo';
import { AuthModule } from '../auth/auth.module';
import { 
  Usuario, 
  Empresa, 
  Usina, 
  Funcionario, 
  EnderecoEmpresa, 
  EnderecoUsina, 
  Peca, 
  Pedido, 
  ItemPedido, 
  ArquivoPedido, 
  Proposta, 
  Pagamento, 
  AvaliacaoEntrega, 
  SolicitacaoBloqueioUsina, 
  BloqueioUsina, 
  HistoricoStatusPedido, 
  ModeloContrato, 
  Notificacao 
} from '../common/entities/core.entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'usinalink'),
        entities: [
          Usuario,
          Empresa,
          Usina,
          Funcionario,
          EnderecoEmpresa,
          EnderecoUsina,
          Peca,
          Pedido,
          ItemPedido,
          ArquivoPedido,
          Proposta,
          Pagamento,
          AvaliacaoEntrega,
          SolicitacaoBloqueioUsina,
          BloqueioUsina,
          HistoricoStatusPedido,
          ModeloContrato,
          Notificacao
        ],
        synchronize: false,
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Usuario,
      Empresa,
      Usina,
      Funcionario,
      Pedido,
      Proposta,
      AvaliacaoEntrega,
      Pagamento,
      Notificacao
    ]),
    AuthModule
  ],
  providers: [SeedDemoService],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
