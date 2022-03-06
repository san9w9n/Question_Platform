/* eslint-disable class-methods-use-this */

const nodemailer = require('nodemailer')
const { Router } = require('express')
const { findUserEmail, saveUserToDB, verifyUser } = require('./user.repository')

class UserController {
  constructor() {
    this.path = '/users'
    this.router = Router()

    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/join/auth', this.joinAuth).post('/join', this.join).post('/login', this.login)
  }

  async joinAuth(req, res) {
    const { email } = req.body
    if (!email || (await findUserEmail(email))) {
      return res.json({
        success: false,
        message: 'NO EMAIL INFO.',
      })
    }

    const mailConfig = {
      service: 'Naver',
      host: 'smtp.naver.com',
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW,
      },
    }

    const authKey = Math.random().toString(36).slice(2)
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: '[Hands up] 이메일 인증 요청 메일입니다.',
      html: `${authKey} 를 입력하세요.`,
    }

    const transporter = nodemailer.createTransport(mailConfig)
    transporter.sendMail(message)
    return res.status(200).json({
      success: true,
      authKey: `${authKey}`,
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
    const dbResult = await saveUserToDB({ email, name, password, hakbeon })
    if (!dbResult) {
      return res.json({
        success: false,
        message: 'DB save failed.',
      })
    }
    return res.status(200).json({
      success: true,
    })
  }

  async login(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        success: false,
        message: 'body information is wrong.',
      })
    }
    const verifyResult = await verifyUser({ email, password })
    if (!verifyResult) {
      return res.json({
        success: false,
        message: 'email or password is wrong.',
      })
    }

    // TODO : 로그인 세션 해야함.
    return res.status(200).json({
      success: true,
    })
  }
}

module.exports = UserController
