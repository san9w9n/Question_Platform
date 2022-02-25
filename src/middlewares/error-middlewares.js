const errorMiddleware = (err, req, res, next) => {
  const code = err.status || 500
  // const msg = err.message
  res.json({
    'bad' : 'bad',
  })
}

module.exports = errorMiddleware
