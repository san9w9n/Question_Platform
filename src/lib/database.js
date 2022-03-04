// @ts-check

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Client } = require('pg')

class Database {
  Database() {
    console.log('constructor')
  }

  initializeDatabase() {
    //     async function showStudents() {
    //       const client = await new Client({
    //         user: process.env.PGID,
    //         host: process.env.DB_HOST,
    //         database: process.env.DATABASE,
    //         password: process.env.PGPW,
    //         port: 5432,
    //         ssl: {
    //           rejectUnauthorized: false,
    //         },
    //       })
    //       // this.client.connect((err) => {
    //       //   if (err) console.log('database connection failed.')
    //       //   else console.log('database connection success.')
    //       // })
    //       // error handling
    //       // this.client.on('error', (err) => {
    //       //   console.error('Database error', err.stack)
    //       // })
    //       await client.connect((err) => {
    //         if (err) console.log('database connection failed.')
    //         else console.log('database connection success.')
    //       })
    //       const query = await client.query('SELECT * FROM students')
    //       const students = []
    //       await query.rows.forEach((row) => {
    //         students.push(row)
    //       })
    //       console.log(students)
    //       await client.end()
    //     }
    //     showStudents()
  }
}

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
  Database,
  client,
}
