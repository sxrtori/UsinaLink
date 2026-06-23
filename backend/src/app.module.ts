import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { EmpresaModule } from './empresa/empresa.module';
import { FuncionarioModule } from './funcionario/funcionario.module';
import { PedidoModule } from './pedido/pedido.module';
import { PropostaModule } from './proposta/proposta.module';
import { UsuarioModule } from './usuario/usuario.module';
import { UsinaModule } from './usina/usina.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true'
      })
    }),
    EmpresaModule,
    UsinaModule,
    UsuarioModule,
    FuncionarioModule,
    PedidoModule,
    PropostaModule,
    DatabaseModule
  ],
  controllers: [AppController]
})
export class AppModule {}
