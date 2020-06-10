const express = require('express');
const io = require('socket.io');
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
    this.io = io(this.server);

    this.io.on('connection', socket => {
      // const { user_id } = socket.handshake.query;
      const user_id = socket.id;
      this.connectedUsers[user_id] = socket.id;

      console.log(this.connectedUsers);

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
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
