import { Global, Module } from '@nestjs/common';
import { JsonDatabaseService } from './json-database.service';
import { SeedDemoService } from './seed-demo';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({ imports: [AuthModule], providers: [JsonDatabaseService, SeedDemoService], exports: [JsonDatabaseService] })
export class DatabaseModule {}
