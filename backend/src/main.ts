import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = app.get(ConfigService).get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`UsinaLink NestJS backend rodando em http://localhost:${port}`);
}

void bootstrap();
