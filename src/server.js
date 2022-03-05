/* eslint-disable no-console */

const App = require('./app')
const IndexController = require('./api/index/index.controller')
const UserController = require('./api/users/user.controller')
const { client } = require('./lib/database')

function startServer() {
  client.connect((err) => {
    if (err) console.log('DB connect failed!')
    else console.log('DB connect success!')
  })
  const app = new App([new IndexController(), new UserController()])
  app.listen()
}

startServer()
