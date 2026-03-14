import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const cookieParser = require('cookie-parser');
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cookie Support
  app.use(cookieParser());

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Food Bite & Dine-In API')
    .setDescription('Backend API for Food Delivery and Dine-In MVP')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth','Authentication API')
    .addTag('Users','Users API')
    .addTag('Menu','Delivery Menu API')
    .addTag('Orders','Delivery Orders API')
    // DineIn
    .addTag('DineIn - Tables','Admin Table Management')
    .addTag('DineIn - Menu','Guest/Admin DineIn Menu')
    .addTag('DineIn - Sessions','Guest Session Management')
    .addTag('DineIn - Orders','Guest/Admin DineIn Orders')
    .addTag('DineIn - Heatmap','Restaurant Busyness API')
    .addTag('DineIn - Payments','Bill & Payment Management')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
