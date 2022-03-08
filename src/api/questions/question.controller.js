/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const QuestionRepository = require('./question.repository')

class QuestionController {
  constructor() {
    this.QuestionRepository = new QuestionRepository()
    this.path = '/courses'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .post('/:course_id/list', this.indexQuestion.bind(this))
      .post('/:course_id/:question_id', this.showQuestion.bind(this))
      // .post('/:course_id/:question_id/test', this.test.bind(this))
      .post('/:course_id', this.createQuestion.bind(this))
      .param('course_id', (req, res, next, value) => {
        req.courseId = value
        next()
      })
      .param('question_id', (req, res, next, value) => {
        req.questionId = value
        next()
      })
  }

  async indexQuestion(req, res) {
    console.log('indexQuestion')

    const { courseId } = req
    if (!courseId) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO',
      })
    }

    const questionList = await this.QuestionRepository.index(courseId)
    return res.send(questionList)
  }

  async showQuestion(req, res) {
    console.log('showQuestion')

    const { questionId } = req
    if (!questionId) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO',
      })
    }

    const questionInfo = await this.QuestionRepository.show(questionId)
    return res.send(questionInfo)
  }

  async createQuestion(req, res) {
    console.log('createQuestion')

    const { userId, courseId, title, content } = req
    // image 처리
    const image = null
    if (!userId || !courseId || !title || !content) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO',
      })
    }

    const createResult = await this.QuestionRepository.insert({
      userId,
      courseId,
      title,
      content,
      image,
    })
    const message = createResult ? 'Question regestered.' : 'Create failed.'
    return res.json({
      createResult,
      message,
    })
  }

  async test(req, res) {
    console.log('test')

    const { courseId, questionId } = req
    const result = await this.QuestionRepository.test({ courseId, questionId })

    return res.send(result)
  }
}

module.exports = QuestionController
