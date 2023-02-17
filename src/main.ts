import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from './utilModules/prisma/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //env conf
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  //swager conf
  const config = new DocumentBuilder().setTitle('OHIF DOCS').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/doc', app, document);

  //this is Cors conf
  app.enableCors();

  //Prisma Error handler
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
