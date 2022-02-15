const notFoundMiddleware = (req, res, next) => {
  res.status(404).render('error', {
    code: '404',
    msg: 'Not Found',
  })
  next()
}

module.exports = notFoundMiddleware
