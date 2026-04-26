const request = require('supertest');

// Mock the pool before requiring the app
jest.mock('../db/pool', () => require('../__mocks__/poolMock'));
const pool = require('../db/pool');
const app = require('../app');

describe('Workouts API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/workouts', () => {
    it('returns an array of workouts', async () => {
      const rows = [
        { id: 1, type: 'Running', duration: 30, notes: '', created_at: '2026-04-26T00:00:00Z' },
      ];
      pool.query.mockResolvedValue({ rows });

      const res = await request(app).get('/api/workouts');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });

    it('returns 500 on database error', async () => {
      pool.query.mockRejectedValue(new Error('DB down'));

      const res = await request(app).get('/api/workouts');
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/workouts', () => {
    it('creates a workout with valid data', async () => {
      const workout = { id: 2, type: 'Yoga', duration: 45, notes: 'Morning session', created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [workout] });

      const res = await request(app)
        .post('/api/workouts')
        .send({ type: 'Yoga', duration: 45, notes: 'Morning session' });

      expect(res.status).toBe(201);
      expect(res.body.type).toBe('Yoga');
    });

    it('rejects when type is missing', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .send({ duration: 30 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/type/i);
    });

    it('rejects when duration is missing', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .send({ type: 'Running' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/duration/i);
    });

    it('rejects when duration is not a positive number', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .send({ type: 'Running', duration: -5 });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/positive/i);
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    it('deletes an existing workout', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const res = await request(app).delete('/api/workouts/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 404 for non-existent workout', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const res = await request(app).delete('/api/workouts/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });
});
