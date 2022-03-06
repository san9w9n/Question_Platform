/* eslint-disable class-methods-use-this */

const nodemailer = require('nodemailer')
const { Router } = require('express')
const { hash } = require('bcrypt')
const { findUserEmail, saveUserToDB, verifyUser } = require('./user.repository')
const campusNameData = require('./campusNameToEmail.json')

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

    if (await findUserEmail(email)) {
      return res.json({
        success: false,
        message: 'ALREADY JOINED.',
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
    const { email, name, hakbeon } = req.body
    const inputPassword = req.body.password

    if (!email || !name || !inputPassword || !hakbeon) {
      return res.json({
        success: false,
        message: 'body information is wrong.',
      })
    }

    const password = await hash(inputPassword, 10)
    if (!(await saveUserToDB({ email, name, password, hakbeon }))) {
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
