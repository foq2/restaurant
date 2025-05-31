import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.method, req.url);
    next();
  });

  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
