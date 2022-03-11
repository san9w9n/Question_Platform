const { queryAtOnce } = require('../lib/database')
const { sign, verify } = require('../lib/jwt')

const verifyToken = (req, res, next) => {
  const access = req.cookies.accessToken
  if (!access) {
    res.status(401).json({
      success: false,
      message: 'Login please.',
    })
    return
  }
  const { verified, body } = verify(access, false)
  if (!verified) {
    res.status(401).json({
      success: false,
      message: body.name,
    })
    return
  }
  req.user_id = body.id
  next()
}

const issueAccessToken = async (req, res) => {
  const access = req.cookies.accessToken
  const refresh = req.cookies.refreshToken
  if (!access || !refresh) {
    return res.status(400).json({
      success: false,
      message: 'Append both accesstoken and refreshtoken.',
    })
  }

  const { verified: refreshVerified, body } = verify(refresh, true)
  if (!refreshVerified) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token expired, login again.',
    })
  }

  const { verified: accessVerified } = verify(access, false)
  if (accessVerified) {
    return res.status(400).json({
      success: false,
      message: 'Do not need to issue access token again.',
    })
  }

  const rows = queryAtOnce('SELECT * FROM tokens WHERE user_id=$1', [body.id])
  if (!rows.length || rows[0].refresh_token !== refresh) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is changed, login again.',
    })
  }

  const newAccessToken = sign(
    {
      id: body.id,
      email: body.email,
    },
    undefined,
    false
  )

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
  })
  return res.status(200).json({
    success: true,
    message: 'Access token is reissued.',
  })
}

module.exports = {
  verifyToken,
  issueAccessToken,
}
