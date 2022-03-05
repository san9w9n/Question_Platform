// @ts-check

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Pool } = require('pg')
const config = require('./config')

const pool = new Pool(config)

async function query(_query, params) {
  const { rows } = await pool.query(_query, params)
  return rows
}

module.exports = {
  query,
}
