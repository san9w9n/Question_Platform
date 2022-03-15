/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { queryAtOnce, queryMore, begin, end } = require('../../lib/database')

class UserRepository {
  async findByEmail(email) {
    const query = `SELECT * FROM students WHERE email like $1`
    const params = [email]

    const rows = queryAtOnce(query, params)
    return rows ? rows[0] : undefined
  }

  async create(userInfo) {
    const query = `INSERT INTO students(name, email, password, hakbeon) VALUES ($1, $2, $3, $4)`
    const params = [userInfo.name, userInfo.email, userInfo.password, userInfo.hakbeon]

    return queryAtOnce(query, params)
  }

  async saveRefreshToken(refreshToken, userId) {
    const delQuery = `DELETE FROM tokens WHERE user_id=$1`
    const delParams = [userId]

    const inQuery = `INSERT INTO tokens(refresh_token, user_id) VALUES ($1, $2)`
    const inParams = [refreshToken, userId]

    const client = await begin()
    if (!client) {
      return false
    }
    const deleteResult = await queryMore(delQuery, delParams, client)
    if (!deleteResult) {
      return false
    }
    const insertResult = await queryMore(inQuery, inParams, client)
    if (!insertResult) {
      return false
    }
    await end(client)
    return true
  }

  async createEmailCode(email, authKey) {
    const query = `INSERT INTO emailtokens(email, authkey, verified) VALUES ($1, $2, $3)`
    const params = [email, authKey, 'false']

    return this.queryAtOnce(query, params)
  }

  async verifyEmailCode(email, authKey) {
    const findQuery = `SELECT * FROM emailtokens WHERE email like $1 and authkey=$2`
    const findParams = [email, authKey]

    const upQuery = `UPDATE emailtokens SET verified='true' WHERE email like $1`
    const upParams = [email]

    const client = await begin()
    if (!client) {
      return false
    }
    const findResult = await queryMore(findQuery, findParams, client)
    if (!findResult) {
      return false
    }
    if (!findResult.length) {
      await end(client)
      return false
    }
    const updateResult = await queryMore(upQuery, upParams, client)
    if (!updateResult) {
      return false
    }

    await end(client)
    return true
  }

  async isEmailVerified(email) {
    const findQuery = `SELECT * FROM emailtokens WHERE email=$1 and verified=$2`
    const findParams = [email, 'true']

    const delQuery = `DELETE FROM emailtokens WHERE email=$1`
    const delParams = [email]

    const client = await begin()
    if (!client) {
      return false
    }
    const findResult = await queryMore(findQuery, findParams, client)
    if (!findResult) {
      return false
    }
    if (!findResult.length) {
      await end(client)
      return false
    }
    const deleteResult = await queryMore(delQuery, delParams, client)
    if (!deleteResult) {
      return false
    }
    await end(client)
    return true
  }

  async deleteEmailCode(email) {
    const query = `DELETE FROM emailtokens WHERE email=$1`
    const params = [email]

    const deleteResult = await queryAtOnce(query, params)
    if (!deleteResult) {
      return false
    }
    return true
  }

  async changePassword(email, newPassword) {
    const query = `UPDATE students SET password=$1 WHERE email like $2`
    const params = [newPassword, email]

    const updateResult = await queryAtOnce(query, params)
    if (!updateResult) {
      return false
    }
    return true
  }

  async deleteUser(email) {
    const query = `DELETE FROM students WHERE email like $1`
    const params = [email]

    const deleteResult = await queryAtOnce(query, params)
    if (!deleteResult) {
      return false
    }
    return true
  }
}

module.exports = UserRepository
