const errorMiddleware = (err, _req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Unknown error.'
  res.status(status).json({
    success: false,
    message,
  })
  next()
}

module.exports = errorMiddleware
