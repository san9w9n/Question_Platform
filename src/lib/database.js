/* eslint-disable no-console */

const { Client } = require('pg')

let db

function initializeDatabase() {
  db = new Client({
    user: process.env.PGID,
    password: process.env.PGPW,
    database: 'everydayCoding',
  })
  db.connect((err) => {
    if (err) {
      console.log('DB connection failed.')
      console.log(err)
    }
    else console.log('DB connected.')
  })
}

async function end() {
  if (db) await this.client.end()
}

module.exports = {
  db,
  initializeDatabase,
  end,
}
