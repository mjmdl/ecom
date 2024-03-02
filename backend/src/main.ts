import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import * as cors from 'cors';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';
import {VALIDATION_CONFIG} from './configs/validation.config';
import {useContainer} from 'class-validator';
import {CORS_CONFIG} from './configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors(CORS_CONFIG));

  app.useGlobalPipes(new ValidationPipe(VALIDATION_CONFIG));
  useContainer(app.select(AppModule), {fallbackOnErrors: true});

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('APPLICATION_PORT'), () =>
    app.getUrl().then((url) => console.log(`Listening to ${url}.`)),
  );
}
bootstrap();
