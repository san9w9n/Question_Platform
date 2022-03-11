const nodemailer = require('nodemailer')
const { hash, compare } = require('bcrypt')
const { sign } = require('../../lib/jwt')
const { mailConfig } = require('../../config')

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async verifyEmail(email) {
    if (await this.userRepository.findByEmail(email)) {
      return false
    }

    const authKey = Math.random().toString(36).slice(2)
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: '[Hands up] 이메일 인증 요청 메일입니다.',
      html: `${authKey} 를 입력하세요.`,
    }

    if (!(await this.userRepository.createEmailToken(email, authKey))) {
      return false
    }

    const transporter = nodemailer.createTransport(mailConfig)
    transporter.sendMail(message)

    return true
  }

  async verifyAuthkey(email, authKey) {
    return this.userRepository.verifyEmailToken(email, authKey)
  }

  async join(email, name, inputPassword, hakbeon) {
    if (!(await this.userRepository.isEmailVerified(email))) {
      return false
    }
    const password = await hash(inputPassword, 10)
    return this.userRepository.create({ email, name, password, hakbeon })
  }

  async login(email, inputPassword) {
    const student = await this.userRepository.findByEmail(email)
    if (!student) {
      return undefined
    }

    const result = await compare(inputPassword, student.password)
    if (!result) {
      return undefined
    }

    const refreshToken = sign(
      {
        id: student.user_id,
        email: student.email,
      },
      undefined,
      true
    )
    const accessToken = sign(
      {
        id: student.user_id,
        email: student.email,
      },
      undefined,
      false
    )
    await this.userRepository.saveRefreshToken(refreshToken, student.user_id)

    return {
      accessToken,
      refreshToken,
    }
  }

  async verifyExpire(email) {
    return this.userRepository.expireAuthKey(email)
  }
}

module.exports = UserService
