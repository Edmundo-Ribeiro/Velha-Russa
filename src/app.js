const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');

const router = require('./router');

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.initSocket();
    this.initMiddlewares();
    this.initRouter();

    this.connectedUsers = {};
  }

  initSocket() {
    this.io = socketio(this.server);

    this.io.on('connection', socket => {
      // const { user_id } = socket.handshake.query;
      const userId = socket.id;
      this.connectedUsers[userId] = socket.id;

      console.log(this.connectedUsers);

      socket.on('disconnect', () => {
        // quando usar diferentes namespaces
        // https://stackoverflow.com/questions/26400595/socket-io-how-do-i-remove-a-namespace
        delete this.connectedUsers[userId];
      });

      socket.on('new-game', data => {
        console.log('data:', data);
      });
    });
  }

  initMiddlewares() {
    this.app.use(express.static(path.resolve(__dirname, '..', 'public')));
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;
      return next();
    });
  }

  initRouter() {
    this.app.use(router);
  }
}

module.exports = new App().server;
