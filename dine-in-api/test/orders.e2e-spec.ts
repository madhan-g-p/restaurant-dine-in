import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, closeTestApp } from './test-helper';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let menuItemId: string;
  let orderId: string;
  let expectedTotal: number;

  beforeAll(async () => {
    app = await createTestApp();

    // 1. Signup to get token
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Order User',
        email: 'order@example.com',
        password: 'password123',
        address: '123 Order St',
        phone: '1234567890',
      });
    authToken = signupRes.body.data.token;

    // 2. Get a menu item ID (seeded by MenuService on init)
    const menuRes = await request(app.getHttpServer()).get('/menu');
    const firstItem = menuRes.body.data.items[0];
    menuItemId = firstItem._id;
    const menuItemPrice = firstItem.price;
    expectedTotal = (menuItemPrice * 2) + 5; // 2 items + $5 delivery fee
  });

  afterAll(async () => {
    await closeTestApp(app);
  });

  it('/order (POST) - Create Order (Fail Unauthorized)', async () => {
    await request(app.getHttpServer())
      .post('/order')
      .send({
        items: [{ menuItem: menuItemId, quantity: 2 }],
        deliveryDetails: { name: 'Test', address: 'Test Addr', phone: '123' },
      })
      .expect(401);
  });

  it('/order (POST) - Create Order (Success)', async () => {
    const response = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [{ menuItem: menuItemId, quantity: 2 }],
        deliveryDetails: { name: 'Test', address: '123 Test Street, City', phone: '1234567890' },
      })
      .expect(201);

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.status).toBe('Order Received');
    expect(response.body.data.totalAmount).toBe(expectedTotal);
    orderId = response.body.data._id;
  });

  it('/order (POST) - Create Order (Invalid Menu Item ID)', async () => {
    await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [{ menuItem: '60d5ec01f0c2a8c3d8e9e1a1', quantity: 2 }], // Valid ObjectId but non-existent
        deliveryDetails: { name: 'Test', address: '123 Test Street, City', phone: '1234567890' },
      })
      .expect(404);
  });

  it('/order (POST) - Create Order (Malformed Menu Item ID)', async () => {
    await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        items: [{ menuItem: 'invalid-id', quantity: 2 }],
        deliveryDetails: { name: 'Test', address: '123 Test Street, City', phone: '1234567890' },
      })
      .expect(400);
  });

  it('/order/:id (GET) - Get Order Details', async () => {
    const response = await request(app.getHttpServer())
      .get(`/order/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data._id).toBe(orderId);
  });

  it('/order/:id/status (GET) - Get Order Status', async () => {
    const response = await request(app.getHttpServer())
      .get(`/order/${orderId}/status`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.data.status).toBe('Order Received');
  });

  it('/order/:id (GET) - Wrong User Access (Forbidden)', async () => {
    // Create another user
    const otherUserRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123',
        address: 'Other St',
        phone: '0987654321',
      });
    const otherToken = otherUserRes.body.data.token;

    await request(app.getHttpServer())
      .get(`/order/${orderId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });
});
