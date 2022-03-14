/* eslint-disable no-console */

const { Pool } = require('pg')
const { dbConfig } = require('../config')

let pool

const initializeDatabase = async () => {
  pool = new Pool(dbConfig)
  await pool.query(`SELECT NOW()`)
}

const queryAtOnce = async (query, params) => {
  let rows = []
  try {
    const result = await pool.query(query, params)
    rows = result.rows
  } catch (err) {
    return undefined
  }
  return rows
}

const begin = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
  } catch (err) {
    await client.query('ROLLBACK')
    client.release()
    return undefined
  }
  return client
}

const queryMore = async (query, params, client) => {
  let rows = []
  try {
    const result = await client.query(query, params)
    rows = result.rows
  } catch (err) {
    await client.query('ROLLBACK')
    client.release()
    return undefined
  }
  return rows
}

const end = async (client) => {
  await client.query('COMMIT')
  client.release()
}

module.exports = {
  initializeDatabase,
  queryAtOnce,
  begin,
  queryMore,
  end,
}
