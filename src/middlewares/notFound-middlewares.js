// eslint-disable-next-line no-unused-vars
const notFoundMiddleware = (_req, res, _next) => {
  res.json({
    'notFound' : 'notFound',
  })
}

module.exports = notFoundMiddleware
