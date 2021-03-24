const app = require('express')();
const http = require('http').Server(app);
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

  socket.on('update', function (data) {
    console.log(`socket.nsp.name : data`, socket.id, data)
    workspace.emit('update', data);
  });

});

const port = process.env.PORT || '65080';

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
