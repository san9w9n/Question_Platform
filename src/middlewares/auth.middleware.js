const { BadRequestException, UnauthorizedException, HttpException } = require('../common/exceptions')
const { queryAtOnce } = require('../lib/database')
const { sign, verify } = require('../lib/jwt')

const verifyToken = async (req, res, next) => {
  const query = `SELECT * FROM students WHERE email like $1`

  const access = req.cookies.accessToken
  if (!access) {
    throw new UnauthorizedException('login first.')
  }

  const { verified, body } = verify(access, false)
  if (!verified) {
    throw new UnauthorizedException(body.name)
  }

  let rows = []
  try {
    rows = await queryAtOnce(query, [body.email])
  } catch (err) {
    throw new HttpException(500, 'Internal server error.')
  }

  if (!rows.length) {
    throw new UnauthorizedException('Not a user.')
  }
  req.user_id = body.id
  next()
}

const issueAccessToken = async (req, res) => {
  const access = req.cookies.accessToken
  const refresh = req.cookies.refreshToken
  if (!access || !refresh) {
    throw new BadRequestException('Wrong body info.')
  }

  const { verified: refreshVerified, body } = verify(refresh, true)
  if (!refreshVerified) {
    throw new BadRequestException('Login again.')
  }

  const { verified: accessVerified } = verify(access, false)
  if (accessVerified) {
    throw new BadRequestException('Access token issue failed.')
  }

  let rows = []
  try {
    rows = await queryAtOnce(`SELECT * FROM tokens WHERE user_id=$1`, [body.id])
  } catch (err) {
    throw new HttpException(500, 'Database error.')
  }
  if (!rows.length || rows[0].refresh_token !== refresh) {
    throw new BadRequestException('Login again.')
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

  return {
    success: true,
    message: 'Access token is reissued.',
  }
}

module.exports = {
  verifyToken,
  issueAccessToken,
}
