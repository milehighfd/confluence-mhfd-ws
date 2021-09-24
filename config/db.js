const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.POSTGRESQL_DB,
    process.env.POSTGRESQL_USER,
    process.env.POSTGRESQL_PASSWORD,
    {
        host: process.env.POSTGRESQL_HOST,
        port: process.env.POSTGRESQL_PORT,
        dialect: 'mssql',
     databaseVersion: '10.50.6000',
   dialectOptions: {
     instancName: 'XXX',
    // instanceName: 'SQLEXPRESS',
     options:{
       encrypt: false
     }
   },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.authenticate().then(() => {
	console.log('Connected to Database')
}) .catch((error) =>{
console.log('Error'+error)
})



db.board = require('../models/board.model.js')(sequelize, Sequelize);
db.boardProject = require('../models/boardProject.model.js')(sequelize, Sequelize);

module.exports = db;
