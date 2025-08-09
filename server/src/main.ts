import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for frontend integration
  app.enableCors({
    origin: process.env.CORS_URL, // Vite dev server default
    credentials: true,
  });
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
