const { client } = require('../lib/database')

// 어케할까..
/* eslint-disable */
const dbErrorMiddleware = () => {
  client.on('error', (err) => {
    console.error('Database error', err.stack)
  })
}
