/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Router } = require('express')

const { verifyToken } = require('../../middlewares/auth.middleware')

class IndexController {
  constructor() {
    this.path = '/'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.get('/', verifyToken, this.home)
  }

  home(req, res) {
    console.log('here we come')
    res.json({
      good: 'good',
    })
  }
}

module.exports = IndexController
