// import createGame from '../modules/game.js';
// import createRenderer from '../modules/renderer.js';
// import createClickInput from '../modules/input.js';

// const player0 = { id: 'david beckham', symbol: 'circle' };
// const player1 = { id: 'yudi beckham', symbol: 'x' };

// const game = createGame();
// const renderer = createRenderer(document);
// const clickInput = createClickInput(document);

// game.setUp();
// game.setPlayer(player0); // quem que deveria fazer isso???
// game.setPlayer(player1);
// game.state.currentPlayer = game.selectRandomPlayer(); // isso não deveria estar numa função de iniciar a partida?

// renderer.initialize(game.state);

// game.subject.subscribe({
//   topic: 'newMove',
//   observerFunction: renderer.render,
// });

// game.subject.subscribe({
//   topic: 'endGame',
//   observerFunction: renderer.endedGame,
// });

// renderer.render(game.state);

// clickInput.initialize();

// clickInput.subject.subscribe({
//   topic: 'click',
//   observerFunction: game.executeTurn,
// });

// renderer.render(game.state);
