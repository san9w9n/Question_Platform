const dbConfig = {
  user: process.env.PGID,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.PGPW,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
}

const mailConfig = {
  service: 'Naver',
  host: 'smtp.naver.com',
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PW,
  },
}

module.exports = {
  dbConfig,
  mailConfig,
}
