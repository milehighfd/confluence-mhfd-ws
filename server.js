const app = require('express')();
const http = require('http').Server(app);

const {
  updateColumn
} = require('./pg.service');

const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected to Main WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

})

const workspaces = io.of(/.*/);

workspaces.on('connection', (socket) => {

  let workspace = socket.nsp;

  console.log(`Client connected to ${socket.nsp.name} WebSocket`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected from ${socket.nsp.name}`);
  });

  socket.on('update', function (columns) {
    columns.forEach((column, i) => {
      let projects = column.projects;
      projects.forEach(project => {
        updateColumn(i, socket.nsp.name.substr(1), project.projectid);
      })
    })
    console.log(`socket.nsp.name : columns`, socket.id, columns)
    workspace.emit('update', columns);
  });

});

const port = process.env.PORT || '65080';

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
