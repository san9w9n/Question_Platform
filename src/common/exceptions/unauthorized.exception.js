const HttpException = require('./http.exception')

class UnauthorizedException extends HttpException {
  constructor(message = '인증 자격 증명이 유효하지 않습니다.') {
    super(401, message)
  }
}

module.exports = UnauthorizedException
