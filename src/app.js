const express = require('express')
const session = require('express-session')
const errorMiddleware = require('./middlewares/error-middlewares')
const notFoundMiddleware = require('./middlewares/notFound-middlewares')
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
    this.initializeNotFoundHandling()
  }

  listen() {
    const PORT = process.env.PORT || 3000;
    this.app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on ${PORT}`)
    })
  }

  getServer() {
    return this.app
  }

  initializeMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(
      session({
        secret: process.env.sessionSECRET,
        resave: false,
        saveUninitialized: true,
      })
    )
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  initializeNotFoundHandling() {
    this.app.use(notFoundMiddleware)
  }

  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      console.log(`path: ${controller.path}`)
      console.log(controller.router)
      this.app.use(controller.path, controller.router)
    })
  }
}

module.exports = App
