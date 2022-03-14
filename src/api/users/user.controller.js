/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const campusNameData = require('../../../campusNameToEmail.json')
const UserRepository = require('./user.repository')
const UserService = require('./user.service')
const { issueAccessToken } = require('../../middlewares/auth.middleware')
const { BadRequestException, UnauthorizedException, HttpException } = require('../../common/exceptions/index')
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
      .get('/emailcode', wrap(this.getEmailCode.bind(this)))
      .post('/emailcode', wrap(this.verifyEmailCode.bind(this)))
      .delete('/emailcode/:email', wrap(this.deleteEmailCode.bind(this)))
      .post('/join', wrap(this.join.bind(this)))
      .post('/login', wrap(this.login.bind(this)))
      .post('/logout', wrap(this.logout.bind(this)))
  }

  async getEmailCode(req, _res) {
    const { email, campusName } = req.query
    if (!email || !campusName) {
      throw new BadRequestException('Wrong Body Info.')
    }

    const campusEmail = campusNameData[campusName]
    if (!campusEmail) {
      throw new BadRequestException('Unknown campus name.')
    } else if (email.indexOf(campusEmail) === -1) {
      throw new BadRequestException('Not a campus email.')
    }

    await this.userService.getEmailCode(email)
    return {
      success: true,
      message: 'Email auth key is issued.',
    }
  }

  async verifyEmailCode(req, _res) {
    const { email, authKey } = req.body
    if (!email || !authKey) {
      throw new BadRequestException('Wrong Body Info.')
    }

    await this.userService.verifyEmailCode(email, authKey)
    return {
      success: true,
      message: 'Email auth success.',
    }
  }

  async deleteEmailCode(req, _res) {
    const { email } = req.params
    if (!email) {
      throw new BadRequestException('Wrong Body Info.')
    }

    await this.userService.deleteEmailCode(email)
    return {
      success: true,
      message: 'Delete expired authkey.',
    }
  }

  async join(req, _res) {
    const { email, name, password, hakbeon } = req.body

    if (!email || !name || !password || !hakbeon) {
      throw new BadRequestException('Wrong Body Info.')
    }

    await this.userService.join(email, name, password, hakbeon)
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
