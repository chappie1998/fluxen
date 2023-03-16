import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT || 5000;
const WHITE_LIST_DOAMINS = [
  'http://localhost:3000',
  'https://fuelart.vercel.app',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    preflightContinue: false,
    origin: WHITE_LIST_DOAMINS,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  // console.log(`Application running at ${await app.getUrl()}`);
}
bootstrap();
