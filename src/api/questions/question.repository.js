/* eslint-disable class-methods-use-this */
const { queryAtOnce } = require('../../lib/database')

class QuestionRepository {
  async index(courseId) {
    const sql = `
      SELECT question_id, title, content, created_at
      FROM questions
      WHERE course_id=$1
    `
    const rows = await queryAtOnce(sql, [courseId])
    return rows
  }

  async show(questionId) {
    const sql = `
      SELECT user_id, title, content, image, created_at
      FROM questions
      WHERE question_id=$1
    `
    const rows = await queryAtOnce(sql, [questionId])
    // rows.length가 1이 아닐 시 에러처리
    return rows[0]
  }

  async create(questionInfo) {
    const sql = `
      INSERT INTO questions(user_id, course_id, title, content, image)
      VALUES ($1, $2, $3, $4, $5)
    `
    try {
      await queryAtOnce(sql, [
        questionInfo.userId,
        questionInfo.courseId,
        questionInfo.title,
        questionInfo.conent,
        questionInfo.image,
      ])
    } catch (err) {
      return false
    }
    return true
  }

  async test(info) {
    const sql = `
    SELECT user_id, name, email
    FROM students
    WHERE user_id>$1 and user_id<$2
    `
    const rows = await queryAtOnce(sql, [info.courseId, info.questionId])
    return rows
  }
}

module.exports = QuestionRepository
