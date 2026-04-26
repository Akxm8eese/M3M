const request = require('supertest');

jest.mock('../db/pool', () => require('../__mocks__/poolMock'));
const pool = require('../db/pool');
const app = require('../app');

describe('Todos API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /api/todos', () => {
    it('returns all todos', async () => {
      const rows = [
        { id: 1, text: 'Call client', completed: false, priority: 'high', due_date: null, created_at: '2026-04-26T00:00:00Z' },
      ];
      pool.query.mockResolvedValue({ rows });

      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(rows);
    });
  });

  describe('POST /api/todos', () => {
    it('creates a todo with text only', async () => {
      const todo = { id: 1, text: 'Buy supplies', completed: false, priority: 'medium', due_date: null, created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [todo] });

      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Buy supplies' });

      expect(res.status).toBe(201);
      expect(res.body.text).toBe('Buy supplies');
    });

    it('creates a todo with priority and due date', async () => {
      const todo = { id: 2, text: 'File report', completed: false, priority: 'high', due_date: '2026-05-01', created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [todo] });

      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'File report', priority: 'high', due_date: '2026-05-01' });

      expect(res.status).toBe(201);
      expect(res.body.priority).toBe('high');
    });

    it('rejects empty text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/text/i);
    });

    it('rejects whitespace-only text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/text/i);
    });

    it('rejects invalid priority', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Something', priority: 'urgent' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/priority/i);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates a todo', async () => {
      const updated = { id: 1, text: 'Call client', completed: true, priority: 'high', due_date: null, created_at: '2026-04-26T00:00:00Z' };
      pool.query.mockResolvedValue({ rows: [updated] });

      const res = await request(app)
        .put('/api/todos/1')
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('returns 404 for non-existent todo', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const res = await request(app)
        .put('/api/todos/999')
        .send({ completed: true });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes an existing todo', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const res = await request(app).delete('/api/todos/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 404 for non-existent todo', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const res = await request(app).delete('/api/todos/999');
      expect(res.status).toBe(404);
    });
  });
});
