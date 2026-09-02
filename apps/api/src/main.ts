import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // ✅ Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://www.krevvy.in',
      'https://krevvy.in',
      'https://krevvy-platform.vercel.app',
      'https://krevvy-platform-4uiq3buv4-ajayadithiya001-6649s-projects.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(
    new ResponseInterceptor(app.get(Reflector)),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Krevvy Platform API')
    .setDescription('API documentation for the Krevvy ecommerce platform.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  const port = Number(process.env.PORT) || 3000;

  // ✅ Enable graceful shutdown hooks for production deployment
  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger is available at: http://localhost:${port}/api/v1/docs`);
}

bootstrap();