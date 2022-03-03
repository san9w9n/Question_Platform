// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, _req, res, _next) => {
  const code = err.status || 500
  res.json({
    code: `${code}`,
    error: err,
  })
}

module.exports = errorMiddleware
