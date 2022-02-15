const App = require('./app')
const { initializeDatabase } = require('./lib/database')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')

async function startServer() {
  initializeDatabase()
  const app = new App([new IndexController(), new UserController()])
  app.listen()
}
startServer()
