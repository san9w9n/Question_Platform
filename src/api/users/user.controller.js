/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const campusNameData = require('../../../campusNameToEmail.json')
const UserRepository = require('./user.repository')
const UserService = require('./user.service')
const { issueAccessToken } = require('../../middlewares/auth.middleware')

class UserController {
  constructor() {
    this.userService = new UserService(new UserRepository())
    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/accesstoken', issueAccessToken)
      .post('/verify/email', this.verifyEmail.bind(this))
      .post('/verify/authkey', this.verifyAuthkey.bind(this))
      .post('/verify/expire', this.verifyExpire.bind(this))
      .post('/join', this.join.bind(this))
      .post('/login', this.login.bind(this))
      .post('/logout', this.logout.bind(this))
  }

  async verifyEmail(req, res) {
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

    const success = await this.userService.verifyEmail(email)
    const message = success ? 'Email auth key has issued.' : 'Email auth key issue failed.'

    return res.json({
      success,
      message,
    })
  }

  async verifyAuthkey(req, res) {
    const { email, authKey } = req.body
    if (!email || !authKey) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO.',
      })
    }
    const success = await this.userService.verifyAuthkey(email, authKey)
    const message = success ? 'Email auth success.' : 'Email auth failed.'

    return res.json({
      success,
      message,
    })
  }

  async verifyExpire(req, res) {
    const { email } = req.body
    if (!email) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO.',
      })
    }

    const success = await this.userService.verifyExpire(email)
    const message = success ? 'success' : 'fail'
    return res.json({
      success,
      message,
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

    const tokens = await this.userService.login(email, password)
    const success = !!tokens
    const message = success ? 'Login success.' : 'Login failed.'

    if (success) {
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
      })
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
      })
    }
    return res.json({
      success,
      message,
    })
  }

  async logout(req, res) {
    return res.clearCookie('accessToken').clearCookie('refreshToken').json({
      success: true,
      message: 'Logout success.',
    })
  }
}

module.exports = UserController
