import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/https-exception.filter';

const server = express();

// Add a lightweight CORS middleware at the Express level to handle preflight
// requests even before Nest is fully initialized (important in serverless).
const allowedOrigins = [process.env.FRONTEND_URL || 'https://nest-todo-wsjd.vercel.app', 'http://localhost:5173'];
server.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors({
    origin: ['https://nest-todo-wsjd.vercel.app', 'http://localhost:5173'], 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Use app.init() to prepare the NestJS application
  await app.init();
};

// Local Development logic
if (process.env.NODE_ENV !== 'production') {
  createNestServer(server).then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => console.log(`Server: http://localhost:${port}`));
  });
}

// VERCEL SPECIFIC: Initialize once, cache, and handle init errors gracefully
let isServerInitialized = false;
export default async (req: any, res: any) => {
  if (!isServerInitialized) {
    try {
      await createNestServer(server);
      isServerInitialized = true;
    } catch (err) {
      console.error('Error initializing Nest server:', err);
      // Return a clear 500 so Vercel logs contain the error
      res.status(500).json({ statusCode: 500, error: 'Server initialization failed', message: (err as any)?.message || 'Unknown error' });
      return;
    }
  }

  server(req, res);
};