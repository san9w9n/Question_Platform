/* eslint-disable no-console */

const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')

function startServer() {
  const app = new App([new IndexController(), new UserController()])
  app.listen()
}

startServer()
