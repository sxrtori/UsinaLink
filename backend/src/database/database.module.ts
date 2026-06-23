import { Module } from '@nestjs/common';
import { DatabaseSeederService } from './database-seeder.service';
import { JsonDatabaseService } from './json-database.service';

@Module({
  providers: [JsonDatabaseService, DatabaseSeederService],
  exports: [JsonDatabaseService]
})
export class DatabaseModule {}
