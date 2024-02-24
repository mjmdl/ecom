import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE_CONFIG } from './app.config';
import { useContainer } from 'class-validator';
import * as cors from 'cors';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
  );

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_CONFIG));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT');
  await app.listen(port).then(() => console.log(`Running at port ${port}.`));
}
bootstrap();
