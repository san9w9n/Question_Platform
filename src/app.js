require('dotenv').config()
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/error.middlewares')

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeMiddlewares()
    this.initializeControllers(controllers)
    this.initializeErrorHandling()
  }

  getServer() {
    return this.app
  }

  listen() {
    const PORT = process.env.PORT || 3000
    this.app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`App listening on ${PORT}`)
    })
  }

  initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(cookieParser())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router)
    })
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

module.exports = App
