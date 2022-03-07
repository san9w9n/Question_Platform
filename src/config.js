const config = {
  user: process.env.PGID,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.PGPW,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
}

module.exports = {
  config,
}
