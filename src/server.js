const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')
const QuestionController = require('./api/questions/question.controller')
const Database = require('./lib/database')

async function startServer() {
  await Database.initializeDatabase()
  const app = new App([new IndexController(), new UserController(), new QuestionController()])
  app.listen()
}

startServer()
