import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

const result = dotenv.config();

console.log('result is result', result);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   prefix: 'api/v', // e.g., /api/v1/diagnose
  //   defaultVersion: '1',
  // });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Strip properties not in DTO
  //     transform: true, // Automatically transform payloads to DTO instances
  //     forbidNonWhitelisted: true, // Throw error if extra properties are sent
  //   }),
  // );

  // // Optional: Swagger API Documentation Setup
  // const swaggerConfig = new DocumentBuilder()
  //   .setTitle('Heart Disease API')
  //   .setDescription('API for heart disease diagnosis and prediction')
  //   .setVersion('1.0')
  //   .addBearerAuth() // If using auth
  //   .build();
  // const document = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('api-docs', app, document);

  // await app.listen(port);
  await app.listen(port, '127.0.0.1');

  console.log('app.getUrl', await app.getUrl());
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api-docs`);
}
bootstrap();
