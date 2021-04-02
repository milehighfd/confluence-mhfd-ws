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

const saveColumns = (board_id, columns) => {
  let projects = [];
  let projectIds = [];
  columns.forEach((column, columnIdx) => {
    column.projects.forEach(project => {
      if (!projectIds.includes(project.project_id)) {
        projects.push(project);
        projectIds.push(project.project_id)
      }
    })
  })
  projects.forEach(p => {
    updateProject(board_id, p);
  })
}

const updateProject = (board_id, project) => {
  client.query('BEGIN', err => {
    if (shouldAbort(err)) return
    const queryText = `
      UPDATE "boardProjects"
      SET position0=$3, position1=$4, position2=$5, position3=$6, position4=$7, position5=$8,
      req1=$9, req2=$10, req3=$11, req4=$12, req5=$13
      WHERE board_id = $1 and project_id = $2;`
    let params = [
      board_id, project.project_id,
      project.position0,
      project.position1,
      project.position2,
      project.position3,
      project.position4,
      project.position5,
      project.req1,
      project.req2,
      project.req3,
      project.req4,
      project.req5,
    ];
    console.log('params', params);
    client.query(queryText, [
      board_id, project.project_id,
      project.position0,
      project.position1,
      project.position2,
      project.position3,
      project.position4,
      project.position5,
      project.req1,
      project.req2,
      project.req3,
      project.req4,
      project.req5,
    ], (err, res) => {
      console.log('res', res)
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
  saveColumns
};
