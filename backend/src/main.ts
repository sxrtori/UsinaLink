import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
  console.log(`UsinaLink NestJS backend rodando em http://localhost:${process.env.PORT || 3001}`);
}

bootstrap();
