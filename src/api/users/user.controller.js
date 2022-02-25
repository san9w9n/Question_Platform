/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const UserRepository = require('./user.repository')

class UserController {
  constructor() {
    this.path = '/user'
    this.router = Router()

    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/signup', this.signup)
      .post('/signup', this.signup)
  }

  signup(req, res) {
    res.send('good')
  }
}

module.exports = UserController
