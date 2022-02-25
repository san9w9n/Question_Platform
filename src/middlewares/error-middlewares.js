const errorMiddleware = (err, req, res, next) => {
  const code = err.status || 500
  // const msg = err.message
  console.log(err)
  res.json({
    'code' : `${code}`,
    'error' : err,
  })
}

module.exports = errorMiddleware
