const HttpException = require('./http.exception')

class ForbidException extends HttpException {
  constructor(message = '접근 권한이 없습니다.') {
    super(403, message)
  }
}

module.exports = ForbidException
