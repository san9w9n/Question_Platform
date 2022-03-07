const nodemailer = require('nodemailer')
const { hash, compare } = require('bcrypt')
const { sign } = require('../../lib/jwt')

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
    this.joinAuth.bind(this)
  }

  async joinAuth(email) {
    if (await this.userRepository.findByEmail(email)) return undefined

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
    return authKey
  }

  async join(email, name, inputPassword, hakbeon) {
    const password = await hash(inputPassword, 10)
    return this.userRepository.create({ email, name, password, hakbeon })
  }

  async login(email, inputPassword) {
    const student = await this.userRepository.findByEmail(email)
    if (!student) {
      return false
    }

    const result = await compare(inputPassword, student.password)
    if (!result) {
      return false
    }

    const refreshToken = sign(
      {
        name: student.name,
        email: student.email,
      },
      undefined,
      true
    )
    await this.userRepository.saveRefreshToken(refreshToken, student.user_id)

    const accessToken = sign(
      {
        name: student.name,
        email: student.email,
      },
      undefined,
      false
    )
    return accessToken
  }
}

module.exports = UserService
