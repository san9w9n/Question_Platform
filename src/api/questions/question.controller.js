/* eslint-disable class-methods-use-this */

const { Router } = require('express')
const multer = require('multer')
const QuestionRepository = require('./question.repository')

class QuestionController {
  constructor() {
    this.QuestionRepository = new QuestionRepository()
    this.path = '/courses'
    this.router = Router()
    this.upload = multer({ dest: 'public/image/' })
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/:course_id', this.indexQuestion.bind(this))
      .get('/:course_id/:question_id', this.showQuestion.bind(this))
      .post('/:course_id', this.upload.single('image'), this.createQuestion.bind(this))
      .param('course_id', this.saveCourseId.bind(this))
      .param('question_id', this.saveQuestionId.bind(this))
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
    return res.json(questionList)
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
    if (!questionInfo) {
      return res.json({
        success: false,
        message: 'NO SUCH QUESTION',
        description: '해당 id에 해당하는 질문이 없습니다.',
      })
    }

    return res.json(questionInfo)
  }

  async createQuestion(req, res) {
    console.log('createQuestion')

    const { courseId } = req
    const { userId, title, content } = req.body
    const image = `/public/image/${req.file.filename}`
    if (!userId || !courseId || !title || !content) {
      return res.json({
        success: false,
        message: 'WRONG BODY INFO',
      })
    }

    const createResult = await this.QuestionRepository.create({
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

  saveCourseId(req, res, next, value) {
    req.courseId = value
    next()
  }

  saveQuestionId(req, res, next, value) {
    req.questionId = value
    next()
  }
}

module.exports = QuestionController
