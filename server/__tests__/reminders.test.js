const request = require('supertest');

jest.mock('../db/pool', () => require('../__mocks__/poolMock'));
const pool = require('../db/pool');
const app = require('../app');

describe('Reminders API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/reminders', () => {
    it('returns all reminders', async () => {
      const rows = [
        { id: 1, title: 'Call client', reminder_time: '2026-04-27T10:00:00Z', completed: false, created_at: '2026-04-26T00:00:00Z' },
      ];
      pool.query.mockResolvedValue({ rows });

      const res = await request(app).get('/api/reminders');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });
  });

  describe('POST /api/reminders', () => {
    it('creates a reminder with valid data', async () => {
      const reminder = { id: 1, title: 'Follow up', reminder_time: '2026-04-28T14:00:00Z', completed: false, created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [reminder] });

      const res = await request(app)
        .post('/api/reminders')
        .send({ title: 'Follow up', reminder_time: '2026-04-28T14:00:00' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Follow up');
    });

    it('rejects missing title', async () => {
      const res = await request(app)
        .post('/api/reminders')
        .send({ reminder_time: '2026-04-28T14:00:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title/i);
    });

    it('rejects empty title', async () => {
      const res = await request(app)
        .post('/api/reminders')
        .send({ title: '  ', reminder_time: '2026-04-28T14:00:00' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/title/i);
    });

    it('rejects missing reminder_time', async () => {
      const res = await request(app)
        .post('/api/reminders')
        .send({ title: 'Do something' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/date|time/i);
    });

    it('rejects invalid date format', async () => {
      const res = await request(app)
        .post('/api/reminders')
        .send({ title: 'Do something', reminder_time: 'not-a-date' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid/i);
    });
  });

  describe('PUT /api/reminders/:id', () => {
    it('updates a reminder', async () => {
      const updated = { id: 1, title: 'Follow up', reminder_time: '2026-04-28T14:00:00Z', completed: true, created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [updated] });

      const res = await request(app)
        .put('/api/reminders/1')
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for non-existent reminder', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app)
        .put('/api/reminders/999')
        .send({ completed: true });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/reminders/:id', () => {
    it('deletes an existing reminder', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const res = await request(app).delete('/api/reminders/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 404 for non-existent reminder', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const res = await request(app).delete('/api/reminders/999');
      expect(res.status).toBe(404);
    });
  });
});
