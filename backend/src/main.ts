import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS habilitado para facilitar o desenvolvimento, mas deve ser configurado adequadamente para produção
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
