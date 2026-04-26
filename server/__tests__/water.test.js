const request = require('supertest');

jest.mock('../db/pool', () => require('../__mocks__/poolMock'));
const pool = require('../db/pool');
const app = require('../app');

describe('Water API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/water/today', () => {
    it('returns today\'s logs and total', async () => {
      const rows = [
        { id: 1, amount: '16.0', created_at: '2026-04-26T08:00:00Z' },
        { id: 2, amount: '8.0', created_at: '2026-04-26T10:00:00Z' },
      ];
      pool.query.mockResolvedValue({ rows });

      const res = await request(app).get('/api/water/today');
      expect(res.status).toBe(200);
      expect(res.body.logs).toHaveLength(2);
      expect(res.body.total).toBe(24);
    });

    it('returns empty logs with zero total', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app).get('/api/water/today');
      expect(res.status).toBe(200);
      expect(res.body.logs).toHaveLength(0);
      expect(res.body.total).toBe(0);
    });
  });

  describe('POST /api/water', () => {
    it('adds water with valid amount', async () => {
      const log = { id: 3, amount: '12.0', created_at: '2026-04-26T12:00:00Z' };
      pool.query.mockResolvedValue({ rows: [log] });

      const res = await request(app)
        .post('/api/water')
        .send({ amount: 12 });

      expect(res.status).toBe(201);
      expect(res.body.amount).toBe('12.0');
    });

    it('rejects missing amount', async () => {
      const res = await request(app)
        .post('/api/water')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/amount/i);
    });

    it('rejects zero amount', async () => {
      const res = await request(app)
        .post('/api/water')
        .send({ amount: 0 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/positive/i);
    });

    it('rejects negative amount', async () => {
      const res = await request(app)
        .post('/api/water')
        .send({ amount: -8 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/positive/i);
    });
  });

  describe('DELETE /api/water/:id', () => {
    it('deletes an existing water log', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const res = await request(app).delete('/api/water/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 404 for non-existent log', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const res = await request(app).delete('/api/water/999');
      expect(res.status).toBe(404);
    });
  });
});
