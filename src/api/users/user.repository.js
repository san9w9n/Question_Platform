/* eslint-disable no-console */
const { client } = require('../../lib/database')

// test

async function showUsers() {
  const query = await client.query('SELECT * FROM students')
  const students = []
  await query.rows.forEach((row) => {
    students.push(row)
  })
  console.log(students)
}

async function findUserEmail(email) {}

function saveUserToDB(userInfo) {
  // param : 유저 정보
  // return : 저장 잘 되었는지 return
  console.log(userInfo)
}

function verifyUser(userInfo) {
  // param : 유저 정보
  // return : db의 정보와 일치하는지 return
  console.log(userInfo)
}

module.exports = {
  showUsers,
  findUserEmail,
  saveUserToDB,
  verifyUser,
}
