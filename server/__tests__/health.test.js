const request = require('supertest');

jest.mock('../db/pool', () => require('../__mocks__/poolMock'));
const app = require('../app');

describe('Health Check', () => {
  it('GET /api/health returns ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
