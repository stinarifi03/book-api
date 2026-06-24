import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // Next.js dev server
    credentials: true,               // allow cookies to be sent
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,    // strips fields not in the DTO
    forbidNonWhitelisted: true, // throws error if unknown fields are sent
    transform: true,
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(err => console.error(err));