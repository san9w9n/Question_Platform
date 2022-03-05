// @ts-check

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Client } = require('pg')

const client = new Client({
  user: process.env.PGID,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.PGPW,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})

client.connect((err) => {
  if (err) console.log('database connection failed.')
  else console.log('database connection success.')
})

// error-handling
client.on('error', (err) => {
  console.error('Database error', err.stack)
})

module.exports = {
  client,
}
