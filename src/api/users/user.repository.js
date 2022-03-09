/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { queryAtOnce, queryMore, begin, end } = require('../../lib/database')

class UserRepository {
  constructor() {
    this.table = 'users'
  }

  async findByEmail(email) {
    const rows = await queryAtOnce(`SELECT * FROM students WHERE email like $1`, [email])
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
      console.err(err.stack)
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
}

module.exports = UserRepository
