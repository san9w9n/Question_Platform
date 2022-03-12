const HttpException = require('./http.exception')

class BadRequestException extends HttpException {
  constructor(message = '잘못된 요청입니다.') {
    super(400, message)
  }
}

module.exports = BadRequestException
