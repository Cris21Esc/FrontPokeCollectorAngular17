/*
/!*
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const MAX_CONNECTIONS = 3; // Límite de conexiones permitidas

io.on('connection', (socket) => {
  if (io.engine.clientsCount > MAX_CONNECTIONS) {
    console.log('Se ha alcanzado el límite de conexiones. Se rechaza una nueva conexión.');
    socket.disconnect(true); // Desconectar el socket
    return;
  }

  console.log('Nuevo usuario conectado');

  // Escuchar el evento 'new-message'
  socket.on('new-message', (message) => {
    console.log('new message:', message);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('new-message', message);
  });

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*!/


////// codigo funcional ^^
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado. Id del socket: ' + socket.id);

  // Emitir el estado actual de las salas al nuevo usuario
  socket.emit('rooms', rooms);

  socket.on('join-room', (room, userId) => {
    // Salir de la sala anterior si está unido a una
    if (socket.room) {
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
    }

    socket.join(room);
    socket.room = room;
    socket.userId = userId;

    if (!rooms[room]) {
      rooms[room] = {
        admin: socket.id,
        users: {}
      };
    }

    rooms[room].users[socket.id] = { userId };

    console.log(`User ${socket.id} joined room ${room} with username ${userId}`);
    io.to(room).emit('join-room', { room, userId });
    io.emit('rooms', rooms);
  });

  socket.on('leave-room', () => {
    if (socket.room) {
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', rooms);
      console.log(`User ${socket.id} left room ${socket.room}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.room) {
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', rooms);
      console.log(`User disconnected`, socket.id);
    }
  });

  socket.on('message', (data) => {
    console.log(data);
    const { room, message } = data;
    io.to(room).emit('message', { userId: socket.userId, message, room });
    console.log(`User ${socket.userId} sent message '${message}' to room ${room}`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
*/
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado. Id del socket: ' + socket.id);

  socket.emit('rooms', Object.keys(rooms));

  socket.on('join-room', (room, userId) => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
    }

    socket.join(room);
    socket.room = room;
    socket.userId = userId;

    if (!rooms[room]) {
      rooms[room] = {
        admin: socket.id,
        users: {},
        messages: []
      };
    }

    rooms[room].users[socket.id] = { userId };

    io.to(room).emit('join-room', { room, userId });
    io.to(room).emit('message', { userId: 'servidor', message: `${userId} se ha unido a la sala.`, room });
    io.emit('rooms', Object.keys(rooms));
  });

  socket.on('leave-room', () => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      io.to(socket.room).emit('message', { userId: 'servidor', message: `${socket.userId} ha abandonado la sala.`, room: socket.room });
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', Object.keys(rooms));
      console.log(`User ${socket.id} left room ${socket.room}`);
    }
  });

  socket.on('disconnect', () => {
    if (socket.room && rooms[socket.room] && rooms[socket.room].users[socket.id]) {
      io.to(socket.room).emit('message', { userId: 'servidor', message: `${socket.userId} se ha desconectado.`, room: socket.room });
      socket.leave(socket.room);
      delete rooms[socket.room].users[socket.id];
      if (Object.keys(rooms[socket.room].users).length === 0) {
        delete rooms[socket.room];
      }
      io.emit('rooms', Object.keys(rooms));
      console.log(`User disconnected`, socket.id);
    }
  });

  socket.on('message', (data) => {
    const { room, message, userId } = data;
    io.to(room).emit('message', { userId, message, room });

    if (rooms[room]) {
      rooms[room].messages.push({ userId, message, room });
      if (rooms[room].messages.length > 10) {
        rooms[room].messages.shift();
      }
    }
  });

  socket.on('request-last-messages', ({ room, count }) => {
    const messages = rooms[room]?.messages || [];
    const lastMessages = messages.slice(-count);
    socket.emit('last-messages', lastMessages);
  });

  socket.on('request-rooms', () => {
    socket.emit('rooms', Object.keys(rooms));
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
