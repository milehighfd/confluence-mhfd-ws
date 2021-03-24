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

const workRequestNs = io.of('work-request');
const workPlanNs = io.of('work-plan');

workRequestNs.on('connection', (socket) => {
  console.log('Client connected to WorkRequest WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('update', function (data) {
    console.log('workRequestNs: data', socket.id, data)
    workRequestNs.emit('update', data);
  });
})

workPlanNs.on('connection', (socket) => {
  console.log('Client connected to WorkPlan WebSocket');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('update', function (data) {
    console.log('workPlanNs: data', socket.id, data)
    workPlanNs.emit('update', data);
  });
})

const port = process.env.PORT || '65080';

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
