const App = require('./app')
const Database = require('./lib/database')
const UserController = require('./api/users/user.controller')
const IndexController = require('./api/index/index.controller')
const QuestionController = require('./api/questions/question.controller')

async function startServer() {
  await Database.initializeDatabase()
  const app = new App([new IndexController(), new UserController(), new QuestionController()])
  app.listen()
}

startServer()
