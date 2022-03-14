const nodemailer = require('nodemailer')
const { hash, compare } = require('bcrypt')
const { sign } = require('../../lib/jwt')
const { mailConfig } = require('../../config')
const { BadRequestException, HttpException } = require('../../common/exceptions')

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async getEmailCode(email) {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new BadRequestException('No user info.')
    }

    const authKey = Math.random().toString(36).slice(2)
    const message = {
      from: process.env.EMAIL,
      to: email,
      subject: '[Hands up] 이메일 인증 요청 메일입니다.',
      html: `${authKey} 를 입력하세요.`,
    }

    const createEmailTokenResult = await this.userRepository.createEmailCode(email, authKey)
    if (!createEmailTokenResult) {
      throw new HttpException(500, 'Internal server error. (save email token)')
    }

    const transporter = nodemailer.createTransport(mailConfig)
    transporter.sendMail(message)
  }

  async verifyEmailCode(email, authKey) {
    const verifyEmailCodeResult = await this.userRepository.verifyEmailCode(email, authKey)
    if (!verifyEmailCodeResult) {
      throw new BadRequestException('Cannot verify email token')
    }
  }

  async deleteEmailCode(email) {
    const deleteEmailCodeResult = await this.userRepository.deleteEmailCode(email)
    if (!deleteEmailCodeResult) {
      throw new HttpException(500, 'Internal server error. (delete email token)')
    }
  }

  async join(email, name, inputPassword, hakbeon) {
    const checkEmailIsVerified = await this.userRepository.isEmailVerified(email)
    if (!checkEmailIsVerified) {
      throw new BadRequestException('Email is not verified.')
    }
    const password = await hash(inputPassword, 10)
    const userCreateResult = this.userRepository.create({ email, name, password, hakbeon })
    if (!userCreateResult) {
      throw new HttpException(500, 'Internal server error. (create user)')
    }
  }

  async login(email, inputPassword) {
    const student = await this.userRepository.findByEmail(email)
    if (!student) {
      throw new BadRequestException('No user info.')
    }

    const result = await compare(inputPassword, student.password)
    if (!result) {
      throw new BadRequestException('Wrong password.')
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
    const saveRefreshTokenResult = await this.userRepository.saveRefreshToken(refreshToken, student.user_id)
    if (!saveRefreshTokenResult) {
      throw new HttpException(500, 'Internal server error. (save refresh token)')
    }

    return {
      accessToken,
      refreshToken,
    }
  }
}

module.exports = UserService
