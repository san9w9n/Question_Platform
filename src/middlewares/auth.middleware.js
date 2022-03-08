const verify = require('../lib/jwt')
const { queryAtOnce } = require('../lib/database')

const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken
  if (!token) {
    res.json({
      success: false,
      message: 'Login first.',
    })
    return
  }

  const decoded = verify(token)
  if (!decoded) {
    res.status(401).json({
      success: false,
      message: 'Auth failed.',
    })
    return
  }

  const { id } = decoded
  const rows = await queryAtOnce(`SELECT * FROM tokens WHERE id=$1`, [id])
  if (!rows.length) {
    // 재발급 받아야함.
  }

  // const decoded = await verify(accessToken, )
  next()
}

module.exports = {
  verifyToken,
}
