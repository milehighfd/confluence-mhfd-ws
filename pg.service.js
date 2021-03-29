const dotenv = require('dotenv')
dotenv.config()

const { Client } = require('pg')

const client = new Client({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DB,
  password: process.env.POSTGRESQL_PASSWORD,
})

client.connect()

const shouldAbort = err => {
  if (err) {
    console.error('Error in transaction', err.stack)
    client.query('ROLLBACK', err => {
      if (err) {
        console.error('Error rolling back client', err.stack)
      }
    })
  }
  return !!err
}

const updateColumn = (column, board_id, projectid) => {
  client.query('BEGIN', err => {
    if (shouldAbort(err)) return
    const queryText = 'UPDATE "boardProjects" SET "column"=$1 WHERE board_id = $2 and project_id = $3;'
    client.query(queryText, [column, board_id, projectid], (err, res) => {
      if (shouldAbort(err)) return
      if (shouldAbort(err)) return
      client.query('COMMIT', err => {
        if (err) {
          console.error('Error committing transaction', err.stack)
        }
      })
    })
  })
}

module.exports = {
  updateColumn
};
