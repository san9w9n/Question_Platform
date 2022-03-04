/* eslint-disable no-console */

const { client } = require('../../lib/database')

async function showUsers() {
  //   console.dir(client)
  const query = await client.query('SELECT * from students')
  const students = []
  await query.rows.forEach((row) => {
    students.push(row)
  })
  console.log(students)
}

function findUserEmail(email) {
  // param : 유저가 입력한 email
  // return : DB에 email 똑같은 거 있나없나. 있으면 true return
  console.log(email)
}

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
