/* eslint-disable class-methods-use-this */

const nodemailer = require('nodemailer')
const { Router } = require('express')
const { findUserEmail } = require('./user.repository')

class UserController {
  constructor() {
    this.path = '/users'
    this.router = Router()

    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.post('/email/auth', this.emailAuth)
  }

  emailAuth(req, res) {
    const { email } = req.body
    if (!email || findUserEmail(email)) {
      res.json({
        success: false,
        message: 'NO EMAIL INFO.',
      })
      return
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

    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: '[Hands up] 이메일 인증 요청 메일입니다.',
      html: '<p> 여기에 인증번호나 token 검증 URL 붙이시면 됩니다! </p>',
    }
    const transporter = nodemailer.createTransport(mailConfig)
    transporter.sendMail(message)
    res.json({
      success: true,
      message: 'email is verified.',
    })
  }
}

module.exports = UserController
