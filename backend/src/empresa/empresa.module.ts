import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmpresaController } from './empresa.controller';
import { empresaProviders } from './empresa.provider';
import { EmpresaService } from './empresa.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmpresaController],
  providers: [...empresaProviders],
  exports: [EmpresaService]
})
export class EmpresaModule {}
