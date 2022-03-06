/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Pool } = require('pg')
const { config } = require('../config')

let pool

async function initializeDatabase() {
  pool = new Pool(config)
}

async function query(_query, params) {
  return pool.query(_query, params).then((res) => res.rows)
}

module.exports = {
  initializeDatabase,
  query,
}
