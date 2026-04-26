/**
 * Global error-handling middleware.
 * Catches unhandled errors thrown inside route handlers / controllers.
 */
function errorHandler(err, _req, res, _next) {
  console.error('Server error:', err.stack || err.message);

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500
      ? 'An unexpected server error occurred. Please try again later.'
      : err.message,
  });
}

module.exports = errorHandler;
