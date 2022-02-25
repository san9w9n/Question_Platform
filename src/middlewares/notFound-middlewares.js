const notFoundMiddleware = (req, res, next) => {
  res.json({
    'notFound' : 'notFound',
  })
}

module.exports = notFoundMiddleware
