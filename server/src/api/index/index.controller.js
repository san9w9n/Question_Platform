/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Router } = require('express')

class IndexController {
  constructor() {
    this.path = '/'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/', this.home)
  }

  home(req, res) {
    res.send('good')
  }
}

module.exports = IndexController
