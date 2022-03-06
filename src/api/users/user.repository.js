/* eslint-disable class-methods-use-this */
const { query } = require('../../lib/database')

class UserRepository {
  constructor() {
    this.table = 'users'
  }

  async findByEmail(email) {
    const rows = await query(`SELECT FROM students WHERE user_email=$1`, [email])
    return rows.length > 0
  }

  async create(userInfo) {
    return query(`INSERT INTO students (user_pw, user_nm, user_email, user_hakbeon) VALUES ($1, $2, $3, $4)`, [
      userInfo.password,
      userInfo.name,
      userInfo.email,
      userInfo.hakbeon,
    ])
      .then(() => true)
      .catch(() => false)
  }

  async verify(userInfo) {
    const rows = await query(`SELECT user_id FROM students WHERE user_pw=$1 and user_email=$2`, [
      userInfo.password,
      userInfo.email,
    ])
    return rows.length && rows[0].user_id
  }
}

module.exports = UserRepository

// error처리 해야함
// email varchar로 바꿈
// 테스트 api 만들기
// 가입날짜
// Client vs. Pool
// 학번이 왜필요했더라
