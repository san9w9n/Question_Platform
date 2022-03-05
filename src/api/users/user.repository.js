/* eslint-disable no-console */
const db = require('../../lib/database')

async function findUserEmail(email) {
  console.log(email)

  let result = false
  const rows = await db.query(`SELECT user_email FROM students`)
  rows.forEach((row) => {
    if (row.user_email.trim() === email) {
      result = true
    }
  })
  return result
}

async function saveUserToDB(userInfo) {
  console.log(userInfo)

  await db.query(`INSERT INTO students VALUES ($1, $2, $3, $4)`, [
    userInfo.password,
    userInfo.name,
    userInfo.email,
    userInfo.hakbeon,
  ])
}

async function verifyUser(userInfo) {
  console.log(userInfo)

  const rows = await db.query(
    `SELECT user_id FROM students WHERE user_pw=$1 and user_email=$2`,
    [userInfo.password, userInfo.email]
  )
  return rows.length && rows[0].user_id
}

module.exports = {
  findUserEmail,
  saveUserToDB,
  verifyUser,
}
