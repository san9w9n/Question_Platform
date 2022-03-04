/* eslint-disable no-console */

function findUserEmail(email) {
  // param : 유저가 입력한 email
  // return : DB에 email 똑같은 거 있나없나. 있으면 true return
  console.log(email)
}

function saveUserToDB(userInfo) {
  // param : 유저 정보
  /*
    userInfo = {
      name: "",
      email: "",
      password: "",
      등등...
    }
   */
  // return : 저장 잘 되었는지 return
  console.log(userInfo)
}

function verifyUser(userInfo) {
  // param : 유저 정보
  // return : db의 정보와 일치하는지 return
  console.log(userInfo)
}

module.exports = {
  findUserEmail,
  saveUserToDB,
  verifyUser,
}
