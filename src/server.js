const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')
const { Database } = require('./lib/database')

async function startServer() {
  const database = new Database()
  database.initializeDatabase()
  const app = new App([new IndexController(), new UserController()])
  app.listen()
}
startServer()
