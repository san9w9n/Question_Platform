const wrap = (handler) => async (req, res, next) => {
  try {
    const response = await handler(req, res, next)
    res.status(200).json(response)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  wrap,
}
