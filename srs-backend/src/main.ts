import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Allowed origins come from CORS_ORIGINS (comma separated) so the deployed
  // frontend can be allowed without a code change. Localhost is always kept
  // so `npm run dev` keeps working.
  const configured = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  const localOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
  const allowlist = [...new Set([...localOrigins, ...configured])];

  app.enableCors({
    origin: allowlist,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 5000;
  // 0.0.0.0 is required so Render's proxy can reach the process.
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 SRS Backend running on http://localhost:${port}`);
  console.log(`   CORS allowed: ${allowlist.join(', ')}`);
}
bootstrap();
