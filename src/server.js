/* eslint-disable no-console */

const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')
const QuestionController = require('./api/questions/question.controller')
const Database = require('./lib/database')

async function startServer() {
  await Database.initializeDatabase()
  console.log(await Database.queryAtOnce(`SELECT * FROM students`))
  const app = new App([new IndexController(), new UserController(), new QuestionController()])
  app.listen()
}

startServer()
