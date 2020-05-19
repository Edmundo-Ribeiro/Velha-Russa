import createGame from './modules/game.js';
import createRenderer from './modules/renderer.js'

const game = createGame();
const renderer = createRenderer(document)

game.setUp();

const player0 = {id: 'david beckham', symbol: 'X'}
const player1 = {id: 'yudi beckham', symbol: 'Y'}

game.state.currentBoardIndex = 4 // como definir que a partida vai começar? 

game.setPlayer(0, player0); //quem que deveria fazer isso???
game.setPlayer(1, player1);

game.state.currentPlayer =  game.selectRandomPlayer();// isso não deveria estar numa função de iniciar a partida?

renderer.initialize(game.state)

renderer.subject.subscribe({
  topic: 'click',
  observerFunction: game.executeTurn
});

game.subject.subscribe({
  topic: 'newMove',
  observerFunction: renderer.render
});

renderer.render(game.state);
