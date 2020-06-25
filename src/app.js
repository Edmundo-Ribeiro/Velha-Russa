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
      const userId = socket.id;
      this.connectedUsers[userId] = socket.id;

      socket.on('disconnect', () => {
        // quando usar diferentes namespaces: segunda resposta
        // https://stackoverflow.com/questions/26400595/socket-io-how-do-i-remove-a-namespace
        delete this.connectedUsers[userId];
      });

      // PLAYER 0 criando o jogo
      socket.on('create-game', ({ player0 }) => {
        console.log(`${player0.id}|${player0.name} criou um jogo`);

        // socket.on('join-game', () => {
        // console.log('o request de entrar chegou no criador!!!');
        socket.on('join-game-success', ({ player1 }) => {
          console.log(`jogador1:${player1.id} entrou no jogo do jogador0`);
          this.io.to(player1.id).emit('join-game-success', { player0 });
        });
        // });
      });

      // PLAYER 1 entrando em um jogo
      socket.on('join-game', ({ targetSocketId, player1 }) => {
        socket.join(targetSocketId);

        console.log(
          `${player1.id}|${player1.name} quer entrar\ncontactando player0...\n`,
        );

        this.io.to(targetSocketId).emit('join-game', { player1 });

        socket.on('joined-game', player0 => {
          this.io.to(socket.id).emit('join-game-success', player1);
        });
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
