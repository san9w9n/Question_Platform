const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')
const { client } = require('./lib/database')

async function startServer() {
  client.connect()
  const app = new App([new IndexController(), new UserController()])
  app.listen()
}

startServer()
