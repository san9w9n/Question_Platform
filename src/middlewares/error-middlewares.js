const errorMiddleware = (err, req, res, next) => {
  const code = err.status || 500
  const msg = err.message
  res.status(code).render('error', {
    code,
    msg,
  })
}

module.exports = errorMiddleware
