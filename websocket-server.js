/*
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
*/


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

// Objeto para almacenar las salas y los usuarios en cada sala
const rooms = {};

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado');

  // Manejar la solicitud de unirse a una sala
  socket.on('join-room', (roomId, userId) => {
    // Verificar si la sala existe, si no, crearla
    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }
    // Verificar si la sala alcanzó el límite de usuarios
    if (Object.keys(rooms[roomId]).length >= MAX_USERS_PER_ROOM) {
      socket.emit('room-full');
      return;
    }
    // Agregar al usuario a la sala
    rooms[roomId][socket.id] = userId;
    // Unir al socket a la sala
    socket.join(roomId);
    // Emitir un evento para confirmar la unión a la sala
    socket.emit('joined-room', roomId);
    // Notificar a los otros usuarios en la sala que un nuevo usuario se ha unido
    socket.to(roomId).emit('user-joined', userId);
  });

  // Manejar la desconexión del usuario
  socket.on('disconnect', () => {
    // Buscar la sala a la que pertenece el usuario y eliminarlo
    for (const roomId in rooms) {
      if (socket.id in rooms[roomId]) {
        delete rooms[roomId][socket.id];
        // Emitir un evento para notificar a los otros usuarios que el usuario se desconectó
        socket.to(roomId).emit('user-left', rooms[roomId][socket.id]);
        break;
      }
    }
  });

  // Resto de la lógica para el chat en vivo dentro de la sala
  // ...
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
