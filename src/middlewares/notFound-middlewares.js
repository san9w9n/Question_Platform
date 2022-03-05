const notFoundMiddleware = (_req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Not Found.',
  })
  next()
}

module.exports = notFoundMiddleware
