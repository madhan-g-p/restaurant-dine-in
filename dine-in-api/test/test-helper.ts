import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../src/app.module';

export const createTestApp = async (): Promise<INestApplication> => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Set environment variables for the test
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  // Save mongod reference to close it later
  (app as any).mongod = mongod;
  
  await app.init();
  return app;
};

export const closeTestApp = async (app: INestApplication) => {
  const mongod = (app as any).mongod;
  await app.close();
  if (mongod) {
    await mongod.stop();
  }
};
