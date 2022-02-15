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
    this.router.get('/signup', this.signup).post('/signup', this.signup)
  }

  signup(req, res) {
    if (req.method === 'GET') {
      res.send('signup')
      return
    }
    const { id, pw, name, email } = req.body
    if (!id || !pw || !name || !email) {
      res.send('Error')
      return
    }
    UserRepository.create([id, pw, name, email])
  }

  signin(req, res) {
    if (req.method === 'GET') {
      res.send('signin')
      return
    }
    const { ID, PW } = req.body
    if (!ID || !PW) {
      // res.send('Error')
    }
  }
}

module.exports = UserController
