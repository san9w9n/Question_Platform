const notFoundMiddleware = (req, res, next) => {
  res.json({
    'bad' : 'bad',
  })
}

module.exports = notFoundMiddleware
