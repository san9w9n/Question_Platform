/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const campusNameData = require('../../../campusNameToEmail.json')
const UserRepository = require('./user.repository')
const UserService = require('./user.service')

class UserController {
  constructor() {
    this.userService = new UserService(new UserRepository())
    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .post('/join/auth', this.joinAuth.bind(this))
      .post('/join', this.join.bind(this))
      .post('/login', this.login.bind(this))
  }

  async joinAuth(req, res) {
    const { email, campusName } = req.body
    if (!email || !campusName) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO.',
      })
    }

    const campusEmail = campusNameData[campusName]
    if (!campusEmail) {
      return res.json({
        success: false,
        message: 'NO CAMPUS INFO.',
      })
    }

    if (email.indexOf(campusEmail) === -1) {
      return res.json({
        success: false,
        message: 'NOT A CAMPUS EMAIL.',
      })
    }

    const authKey = await this.userService.joinAuth(email)
    const success = !!authKey
    const message = success ? 'Email auth key has issued.' : 'Email auth key issue failed.'
    return res.json({
      success,
      message,
      authKey,
    })
  }

  async join(req, res) {
    const { email, name, password, hakbeon } = req.body

    if (!email || !name || !password || !hakbeon) {
      return res.json({
        success: false,
        message: 'body information is wrong.',
      })
    }

    const success = await this.userService.join(email, name, password, hakbeon)
    const message = success ? 'Join success.' : 'Join failed.'
    return res.json({
      success,
      message,
    })
  }

  async login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'Body information is wrong.',
      })
    }

    const success = await this.userService.login(email, password)
    const message = success ? 'Login success.' : 'Login failed.'

    return res.json({
      success,
      message,
    })
  }
}

module.exports = UserController
