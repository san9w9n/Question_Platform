/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const campusNameData = require('../../../campusNameToEmail.json')
const UserRepository = require('./user.repository')
const UserService = require('./user.service')
const { issueAccessToken } = require('../../middlewares/auth.middleware')
const { BadRequestException, UnauthorizedException } = require('../../common/exceptions/index')
const { wrap } = require('../../lib/request-handler')

class UserController {
  constructor() {
    this.userService = new UserService(new UserRepository())
    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/accesstoken', wrap(issueAccessToken))
      .post('/verify/email', wrap(this.verifyEmail.bind(this)))
      .post('/verify/authkey', wrap(this.verifyAuthkey.bind(this)))
      .post('/verify/expire', wrap(this.verifyExpire.bind(this)))
      .post('/join', wrap(this.join.bind(this)))
      .post('/login', wrap(this.login.bind(this)))
      .post('/logout', wrap(this.logout.bind(this)))
  }

  async verifyEmail(req, _res) {
    const { email, campusName } = req.body
    if (!email || !campusName) {
      throw new BadRequestException('Wrong Body Info.')
    }

    const campusEmail = campusNameData[campusName]
    if (!campusEmail) {
      throw new BadRequestException('Unknown campus name.')
    } else if (email.indexOf(campusEmail) === -1) {
      throw new BadRequestException('Not a campus email.')
    }

    if (!(await this.userService.verifyEmail(email))) {
      throw new BadRequestException('Email auth key is not issued.')
    }

    return {
      success: true,
      message: 'Email auth key is issued.',
    }
  }

  async verifyAuthkey(req, _res) {
    const { email, authKey } = req.body
    if (!email || !authKey) {
      throw new BadRequestException('Wrong Body Info.')
    }

    if (!(await this.userService.verifyAuthkey(email, authKey))) {
      throw new BadRequestException('Email auth failed.')
    }

    return {
      success: true,
      message: 'Email auth success.',
    }
  }

  async verifyExpire(req, _res) {
    const { email } = req.body
    if (!email) {
      throw new BadRequestException('Wrong Body Info.')
    }

    if (!(await this.userService.verifyExpire(email))) {
      throw new BadRequestException('Bad.')
    }

    return {
      success: true,
      message: 'Good.',
    }
  }

  async join(req, _res) {
    const { email, name, password, hakbeon } = req.body

    if (!email || !name || !password || !hakbeon) {
      throw new BadRequestException('Wrong Body Info.')
    }

    if (!(await this.userService.join(email, name, password, hakbeon))) {
      throw new BadRequestException('Join failed.')
    }

    return {
      success: true,
      message: 'Join success.',
    }
  }

  async login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new BadRequestException('Wrong Body Info.')
    }

    const tokens = await this.userService.login(email, password)
    if (!tokens) {
      throw new UnauthorizedException('Login failed.')
    }

    res
      .cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
      })
      .cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
      })
    return {
      success: true,
      message: 'Login success.',
    }
  }

  async logout(req, res) {
    res.clearCookie('accessToken').clearCookie('refreshToken')
    return {
      success: true,
      message: 'Logout success.',
    }
  }
}

module.exports = UserController
