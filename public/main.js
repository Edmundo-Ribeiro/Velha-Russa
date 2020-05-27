import createGame from './modules/game.js';
import createRenderer from './modules/renderer.js'

const player0 = {id: 'david beckham', symbol: 'X'};
const player1 = {id: 'yudi beckham', symbol: 'Y'};

const game = createGame();
const renderer = createRenderer(document);

game.setUp();
game.setPlayer(0,player0); //quem que deveria fazer isso???
game.setPlayer(1,player1);
game.state.currentPlayer =  game.selectRandomPlayer();// isso não deveria estar numa função de iniciar a partida?

renderer.initialize(game.state);

renderer.subject.subscribe({
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
