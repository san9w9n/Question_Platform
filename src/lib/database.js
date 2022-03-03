/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Client } = require('pg')

class Database {
  Database() {
    console.log('constructor')
  }

  initializeDatabase() {
    this.client = new Client({
      user: process.env.PGID,
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      password: process.env.PGPW,
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      }
    })
    this.client.connect((err) => {
      if (err) console.log(err)
      else console.log('database connection success.')
    })
  }
}

module.exports = {
  Database,
}
