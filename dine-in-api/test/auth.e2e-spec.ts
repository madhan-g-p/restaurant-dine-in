import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    address: '123 Test St',
    phone: '1234567890',
  };

  it('/auth/signup (POST) - Success', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(mockUser)
      .expect(201);

    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user).toHaveProperty('email', mockUser.email);
  });

  it('/auth/login (POST) - Success', async () => {
    // Signup first (or use seeded data if configured)
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: mockUser.email, password: mockUser.password })
      .expect(201); // Controller returns 201 for POST by default

    expect(response.body.data).toHaveProperty('token');
  });

  it('/auth/login (POST) - Invalid Email', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'password123' })
      .expect(401);
  });

  it('/auth/login (POST) - Invalid Password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: mockUser.email, password: 'wrongpassword' })
      .expect(401);
  });

  it('/auth/login (POST) - Missing fields', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com' })
      .expect(400);
  });
});
