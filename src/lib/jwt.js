const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET || 'JWTSECRET_FOR_TEST'
const algorithm = process.env.JWT_ALGO || 'HS256'

const sign = (payload, options, refreshFlag) =>
  jwt.sign(payload, jwtSecret, {
    algorithm,
    expiresIn: refreshFlag ? '15d' : '30m',
    ...options,
  })

const verify = (token) =>
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return undefined
    return JSON.parse(decoded)
  })

module.exports = {
  sign,
  verify,
}
