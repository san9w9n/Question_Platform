// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, _req, res, _next) => {
  const status = err.status || 500
  const message = err.message || 'Unknown error.'
  res.status(status).json({
    status,
    message,
  })
}

module.exports = errorMiddleware
