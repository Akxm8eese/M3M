/**
 * Shared mock for the pg pool.
 * Each test file can set `pool.query.mockResolvedValue(...)` as needed.
 */
const pool = {
  query: jest.fn(),
  on: jest.fn(),
};

module.exports = pool;
