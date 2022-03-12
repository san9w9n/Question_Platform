const HttpException = require('./http.exception')

class ConflictException extends HttpException {
  constructor(message = '이미 가입되었습니다.') {
    super(409, message)
  }
}

module.exports = ConflictException
