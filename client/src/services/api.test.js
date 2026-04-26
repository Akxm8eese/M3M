import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workoutApi, waterApi, todoApi, reminderApi } from './api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

function jsonResponse(data, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('workoutApi', () => {
  it('getAll calls GET /api/workouts', async () => {
    const data = [{ id: 1, type: 'Running' }];
    mockFetch.mockReturnValue(jsonResponse(data));

    const result = await workoutApi.getAll();
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/workouts',
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
  });

  it('create sends POST with body', async () => {
    const workout = { id: 2, type: 'Yoga' };
    mockFetch.mockReturnValue(jsonResponse(workout));

    const result = await workoutApi.create({ type: 'Yoga', duration: 30 });
    expect(result).toEqual(workout);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/workouts',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('remove sends DELETE', async () => {
    mockFetch.mockReturnValue(jsonResponse({ message: 'deleted' }));
    await workoutApi.remove(5);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/workouts/5',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('throws on error response', async () => {
    mockFetch.mockReturnValue(jsonResponse({ error: 'Bad input' }, 400));
    await expect(workoutApi.create({})).rejects.toThrow('Bad input');
  });
});

describe('waterApi', () => {
  it('getToday calls GET /api/water/today', async () => {
    const data = { logs: [], total: 0 };
    mockFetch.mockReturnValue(jsonResponse(data));

    const result = await waterApi.getToday();
    expect(result).toEqual(data);
  });

  it('add sends POST with amount', async () => {
    mockFetch.mockReturnValue(jsonResponse({ id: 1, amount: 16 }));
    await waterApi.add(16);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/water',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ amount: 16 }),
      })
    );
  });
});

describe('todoApi', () => {
  it('getAll calls GET /api/todos', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));
    const result = await todoApi.getAll();
    expect(result).toEqual([]);
  });

  it('update sends PUT', async () => {
    mockFetch.mockReturnValue(jsonResponse({ id: 1, completed: true }));
    await todoApi.update(1, { completed: true });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/todos/1',
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

describe('reminderApi', () => {
  it('getAll calls GET /api/reminders', async () => {
    mockFetch.mockReturnValue(jsonResponse([]));
    const result = await reminderApi.getAll();
    expect(result).toEqual([]);
  });

  it('create sends POST', async () => {
    const reminder = { id: 1, title: 'Test' };
    mockFetch.mockReturnValue(jsonResponse(reminder));
    await reminderApi.create({ title: 'Test', reminder_time: '2026-04-28T10:00' });
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/reminders',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
