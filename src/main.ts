import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/https-exception.filter';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors();
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

// VERCEL SPECIFIC: We export a function that Vercel calls
export default async (req: any, res: any) => {
  await createNestServer(server);
  server(req, res);
};