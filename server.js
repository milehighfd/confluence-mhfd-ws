const app = require('express')();
const http = require('http').Server(app);

const {
  saveColumns,
  saveReqmanager
} = require('./pg.service');

const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e8,
  pingTimeout: 60000
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
    saveColumns(socket.nsp.name.substr(1), columns);
    //console.log(`socket.nsp.name : columns`, socket.id, columns)
    workspace.emit('update', columns);
  });

  socket.on('reqmanager', function (reqmanager) {
    saveReqmanager(socket.nsp.name.substr(1), reqmanager);
    //console.log(`socket.nsp.name : reqmanager`, socket.id, reqmanager)
    workspace.emit('reqmanager', reqmanager);
  });

});

const port = process.env.PORT || '65080';

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
