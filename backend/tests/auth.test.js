// tests/auth.test.js
// Basic integration tests for the authentication flow.
// Uses mongodb-memory-server so tests run in isolation without a real DB —
// this is what Jenkins' "Run Tests" stage executes.

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

beforeAll(async () => {
mongoServer = await MongoMemoryServer.create({
    binary: {
        version: "7.0.3"
    }
});
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});
describe('Health Check', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Auth Flow', () => {
  const adminPayload = {
    role: 'admin',
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
  };

  it('should register a new admin', async () => {
    const res = await request(app).post('/api/auth/register').send(adminPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe('admin');
  });

  it('should not register the same admin twice', async () => {
    const res = await request(app).post('/api/auth/register').send(adminPayload);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: adminPayload.password,
      role: 'admin',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: 'wrongpassword',
      role: 'admin',
    });
    expect(res.statusCode).toBe(401);
  });

  it('should reject access to protected route without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('should allow access to protected route with valid token', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: adminPayload.password,
      role: 'admin',
    });
    const token = loginRes.body.data.token;

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe(adminPayload.email);
  });
});
