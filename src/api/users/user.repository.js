/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { queryAtOnce, queryMore, begin, end } = require('../../lib/database')

class UserRepository {
  async findByEmail(email) {
    let rows
    try {
      rows = await queryAtOnce(`SELECT * FROM students WHERE email like $1`, [email])
    } catch (err) {
      console.log(err)
      return undefined
    }
    return rows.length ? rows[0] : undefined
  }

  async create(userInfo) {
    try {
      await queryAtOnce(`INSERT INTO students(name, email, password, hakbeon) VALUES ($1, $2, $3, $4)`, [
        userInfo.name,
        userInfo.email,
        userInfo.password,
        userInfo.hakbeon,
      ])
    } catch (err) {
      console.log(err.stack)
      return false
    }
    return true
  }

  async saveRefreshToken(refreshToken, userId) {
    const client = await begin()
    if (!client) {
      return false
    }
    const deleteResult = await queryMore(`DELETE FROM tokens WHERE user_id=$1`, [userId], client)
    if (!deleteResult) {
      return false
    }
    const insertResult = await queryMore(
      `INSERT INTO tokens(refresh_token, user_id) VALUES ($1, $2)`,
      [refreshToken, userId],
      client
    )
    if (!insertResult) {
      return false
    }
    await end(client)
    return true
  }

  async createEmailToken(email, authKey) {
    try {
      await queryAtOnce(`INSERT INTO emailtokens(email, authkey, verified) VALUES ($1, $2, $3)`, [
        email,
        authKey,
        'false',
      ])
    } catch (err) {
      console.log(err.stack)
      return false
    }
    return true
  }

  async verifyEmailToken(email, authKey) {
    const client = await begin()
    if (!client) {
      return false
    }

    const findResult = await queryMore(
      `SELECT * FROM emailtokens WHERE email like $1 and authkey=$2`,
      [email, authKey],
      client
    )
    if (!findResult) {
      return false
    }

    const updateResult = await queryMore(`UPDATE emailtokens SET verified='true' WHERE email=$1`, [email], client)
    if (!updateResult) {
      return false
    }

    await end(client)
    return true
  }

  async isEmailVerified(email) {
    const client = await begin()
    if (!client) {
      return false
    }

    const findResult = await queryMore(`SELECT * FROM emailtokens WHERE email=$1 and authkey=$2`, [email, 1], client)
    if (!findResult) {
      return false
    }
    await queryMore(`DELETE FROM emailtokens WHERE email=$1`, [email], client)
    await end(client)
    return true
  }
}

module.exports = UserRepository
