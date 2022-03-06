/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */

const { Pool } = require('pg')

let pool

class Database {
  static async initializeDatabase() {
    pool = new Pool({
      user: process.env.PGID,
      host: process.env.DB_HOST,
      database: process.env.DATABASE,
      password: process.env.PGPW,
      port: 5432,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  static async query(_query, params) {
    return pool.query(_query, params).then((res) => res.rows)
  }
}

// class Database {
//   static pool

//   static async initializeDatabase() {
//     this.pool = new Pool({
//       user: process.env.PGID,
//       host: process.env.DB_HOST,
//       database: process.env.DATABASE,
//       password: process.env.PGPW,
//       port: 5432,
//       ssl: {
//         rejectUnauthorized: false,
//       },
//     })
//   }

//   static async query(_query, params) {
//     let param
//     if (params && params.constructor === Object) {
//       param = Object.values(params)
//     } else {
//       param = params
//     }
//     const result = await this.pool.query(_query, param)
//     return result.rows
//   }
// }

module.exports = Database
