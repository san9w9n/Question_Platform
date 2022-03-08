/* eslint-disable no-console */

const { Pool } = require('pg')
const { config } = require('../config')

let pool

const initializeDatabase = async () => {
  pool = new Pool(config)
  pool.on('error', (err) => console.err(err.stack))
}

const queryAtOnce = async (query, params) => {
  const { rows } = await pool.query(query, params)
  return rows
}

const begin = async () => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
  } catch (err) {
    console.error(err.stack)
    await client.query('ROLLBACK')
    client.release()
    return undefined
  }
  return client
}

const queryMore = async (query, params, client) => {
  let result
  try {
    result = await client.query(query, params)
  } catch (err) {
    console.error(err.stack)
    await client.query('ROLLBACK')
    client.release()
    return undefined
  }
  return result.rows
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
