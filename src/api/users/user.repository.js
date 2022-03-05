/* eslint-disable no-console */
const { client } = require('../../lib/database')

async function findUserEmail(email) {
  console.log(email)

  let result = false

  const query = await client.query(`SELECT user_email FROM students`)
  query.rows.forEach((row) => {
    if (row.user_email.trim() === email) {
      result = true
    }
  })
  return result
}

async function saveUserToDB(userInfo) {
  console.log(userInfo)

  await client.query(
    `INSERT INTO students VALUES ('${userInfo.password}', '${userInfo.name}', '${userInfo.email}', '${userInfo.hakbeon}')`
  )
  return true
}

async function verifyUser(userInfo) {
  console.log(userInfo)

  const query = await client.query(
    `SELECT user_id FROM students WHERE user_pw='${userInfo.password}' and user_email='${userInfo.email}'`
  )
  return query.rows.length && query.rows[0].user_id
}

module.exports = {
  findUserEmail,
  saveUserToDB,
  verifyUser,
}
