/**
 * Jogo
 */

import createGame from '../modules/game.js';
import createRenderer from '../modules/renderer.js';
import createClickInput from '../modules/input.js';

// const player0 = { id: 'david beckham', symbol: 'circle' };
// const player1 = { id: 'yudi beckham', symbol: 'x' };

let player0 = { id: null, symbol: 'x', name: null };
let player1 = { id: null, symbol: 'circle', name: null };

const game = createGame();
const renderer = createRenderer(document);
const clickInput = createClickInput(document);

game.setUp();
// game.setPlayer(player0); // quem que deveria fazer isso???
// game.setPlayer(player1);
// game.state.currentPlayer = game.selectRandomPlayer(); // isso não deveria estar numa função de iniciar a partida?

renderer.initialize(game.state);

game.subject.subscribe({
  topic: 'newMove',
  observerFunction: renderer.render,
});

game.subject.subscribe({
  topic: 'endGame',
  observerFunction: renderer.endedGame,
});

renderer.render(game.state);

clickInput.initialize();

clickInput.subject.subscribe({
  topic: 'click',
  observerFunction: game.executeTurn,
});

renderer.render(game.state);

/**
 * Conexão
 */
// eslint-disable-next-line no-undef
const socket = io();

socket.on('connect', () => {
  const joinGameButton = document.getElementById('join-game');
  const createGameButton = document.getElementById('create-game');
  const controlPanel = document.getElementById('control-panel');
  const thisClientSocketId = document.getElementById('this-client-socket-id');
  const adversaryClientSocketId = document.getElementById(
    'adversary-client-socket-id',
  );

  joinGameButton.onclick = () => {
    const socketIdInput = document.getElementById('socket-id');

    player1.id = socket.id;
    player1.name = 'Jogador #1';

    socket.emit('join-game', { targetSocketId: socketIdInput.value, player1 });
    controlPanel.style.display = 'none';

    // tem que receber o jogar "inteiro" (nome, id, símbolo etc...)
    socket.on('join-game-success', ({ player0: targetPlayer0 }) => {
      thisClientSocketId.innerText = `Você é ${player1.name}`;
      adversaryClientSocketId.innerText = `Adversário: ${targetPlayer0.name}`;
      console.log('heeeeeeeeeeeeeeeeeeeeeyy', thisClientSocketId);

      player0 = {
        ...player0,
        ...targetPlayer0,
      };
      // Object.assign(player0, targetPlayer0);
    });
  };

  createGameButton.onclick = () => {
    const targetPlayer0 = { id: socket.id, name: 'Jogador #0' };

    thisClientSocketId.innerText = `Você é ${targetPlayer0.name}, \n id: ${targetPlayer0.id}`;
    adversaryClientSocketId.innerText = `Adversário: aguarde...`;
    controlPanel.style.display = 'none';

    socket.emit('create-game', { player0: targetPlayer0 });

    socket.on('join-game', ({ player1: clientPlayer1 }) => {
      // verificações: "já existe um adversário nessa partida?"
      // Object.assign(player0, targetPlayer0);
      player1 = {
        ...player1,
        ...clientPlayer1,
      };

      adversaryClientSocketId.innerText = `Adversário: ${clientPlayer1.name}`;

      socket.emit('join-game-success', { player1: clientPlayer1 });
    });
  };

  // socket.on('ready-to-play', () => {
  //   socket.on('make-move', () => {});
  //   socket.on('click?', () => {});
  // });
});
