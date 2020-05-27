import createGame from './modules/game.js';
import createRenderer from './modules/renderer.js'
import createClickInput from './modules/input.js'

const player0 = {id: 'player0', symbol: 'X'};
const player1 = {id: 'player1', symbol: 'Y'};

const game = createGame();
const renderer = createRenderer(document);
const clickInput = createClickInput(document);

game.setUp();
game.setPlayer(0,player0); //quem que deveria fazer isso???
game.setPlayer(1,player1);
game.state.currentPlayer =  game.selectRandomPlayer();// isso não deveria estar numa função de iniciar a partida?

renderer.initialize(game.state);

renderer.subject.subscribe({
  topic: 'click',
  observerFunction: game.executeTurn
});

clickInput.initialize();

clickInput.subject.subscribe({
  topic: 'click',
  observerFunction: game.executeTurn
});

game.subject.subscribe({
  topic: 'newMove',
  observerFunction: renderer.render
});
game.subject.subscribe({
  topic: 'hasToChooseBoard',
  observerFunction: renderer.render
}); 
game.subject.subscribe({
  topic: 'endGame',
  observerFunction: renderer.endedGame
});

renderer.render(game.state);
