/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

const { db } = require('../../lib/database')

class UserRepository {
  static create(raw) {
    const query = {
      text: 'INSERT INTO public.user(id, pw, name, email) VALUES($1, $2, $3, $4)',
      values: raw,
    }
    db.query(query, (err, res) => {
      if (err) throw new Error('User insert error.')
      else console.log(`User insert successfully. (${res.rows[0]})`)
    })
  }
}

module.exports = UserRepository
