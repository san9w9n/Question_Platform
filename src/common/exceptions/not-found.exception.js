const HttpException = require('./http.exception')

class NotFoundException extends HttpException {
  constructor(message = '찾을 수 없습니다.') {
    super(404, message)
  }
}

module.exports = NotFoundException
