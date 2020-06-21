import createGame from '../game.js';

const createObserver = require('../observer.js');

let game;
let player0;

describe('Possible game states', () => {
  beforeEach(() => {
    player0 = { id: 'david beckham', symbol: 'circle' };
    const player1 = { id: 'yudi beckham', symbol: 'x' };

    game = createGame();

    game.setUp();
    game.setPlayer(player0);
    game.setPlayer(player1);
    game.state.currentPlayer = player0;
  });

  it('Should be able to start a game and notify it', () => {
    const mockFunction = jest.fn(gameState => gameState);

    game.subject.subscribe({
      topic: 'startedGame',
      observerFunction: mockFunction,
    });
    game.executeTurn('4_4');

    expect(mockFunction).toHaveBeenCalled();
    expect(game.state.startedGame).toEqual(true);
  });

  it('Should be able to conquer a board and notify it', () => {
    const mockFunction = jest.fn(boardIndex => boardIndex);

    game.subject.subscribe({
      topic: 'conqueredBoard',
      observerFunction: mockFunction,
    });

    game.executeTurn('5_3');
    game.executeTurn('3_5');
    game.executeTurn('5_4');
    game.executeTurn('4_5');
    game.executeTurn('5_5');

    expect(mockFunction).toHaveBeenCalledWith(5);
    expect(game.state.boards[5].conqueredBy).not.toBe(null);
  });

  it('Should be able to tie a board and notify it', () => {
    const mockFunction = jest.fn(boardIndex => boardIndex);

    game.subject.subscribe({
      topic: 'tiedBoard',
      observerFunction: mockFunction,
    });

    game.executeTurn('5_5');
    game.executeTurn('5_2');
    game.executeTurn('2_5');
    game.executeTurn('5_1');
    game.executeTurn('1_5');
    game.executeTurn('5_3');
    game.executeTurn('3_5');
    game.executeTurn('5_7');
    game.executeTurn('7_5');
    game.executeTurn('5_8');
    game.executeTurn('8_8');
    game.executeTurn('8_5');
    game.executeTurn('5_4');
    game.executeTurn('4_5');
    game.executeTurn('5_0');
    game.executeTurn('0_5');
    game.executeTurn('5_6');

    expect(game.state.boards[5].conqueredBy).toBe('tie');
    expect(mockFunction).toHaveBeenCalledWith(5);
  });

  it('Should be able to Win a game and notify it', () => {
    const mockFunction = jest.fn(infoAboutTheEnd => infoAboutTheEnd.result);

    game.subject.subscribe({
      topic: 'endGame',
      observerFunction: mockFunction,
    });

    game.executeTurn('5_3');
    game.executeTurn('3_5');
    game.executeTurn('5_4');
    game.executeTurn('4_5');
    game.executeTurn('5_5');

    game.executeTurn('2_2');
    game.executeTurn('2_1');
    game.executeTurn('1_2');
    game.executeTurn('2_4');
    game.executeTurn('4_2');
    game.executeTurn('2_7');

    game.executeTurn('7_8');
    game.executeTurn('8_6');
    game.executeTurn('6_8');
    game.executeTurn('8_3');
    game.executeTurn('3_8');
    game.executeTurn('8_0');

    expect(game.state.boards[2].conqueredBy).not.toBe(null);
    expect(game.state.boards[5].conqueredBy).not.toBe(null);
    expect(game.state.boards[8].conqueredBy).not.toBe(null);
    expect(game.state.ended).toBe(true);
    expect(mockFunction).toHaveBeenCalled();
    expect(mockFunction).toHaveReturnedWith('won');
  });

  it('Should be able to Tie a game and notify it', () => {
    const mockFunction = jest.fn(infoAboutTheEnd => infoAboutTheEnd.result);

    game.subject.subscribe({
      topic: 'endGame',
      observerFunction: mockFunction,
    });

    game.executeTurn('5_3');
    game.executeTurn('3_5');
    game.executeTurn('5_4');
    game.executeTurn('4_5');

    game.state.boards[0].conqueredBy = 'tie';
    game.state.boards[1].conqueredBy = 'tie';
    game.state.boards[2].conqueredBy = 'tie';
    game.state.boards[3].conqueredBy = 'tie';
    game.state.boards[4].conqueredBy = 'tie';
    game.state.boards[6].conqueredBy = 'tie';
    game.state.boards[7].conqueredBy = 'tie';
    game.state.boards[8].conqueredBy = 'tie';

    game.executeTurn('5_5');

    expect(game.state.ended).toBe(true);
    expect(mockFunction).toHaveBeenCalled();
    expect(mockFunction).toHaveReturnedWith('tied');
  });

  it('Should be able to enter in a "has to choose board" situation and notify it', () => {
    const mockFunction = jest.fn(hasToChooseBoard => hasToChooseBoard);

    game.subject.subscribe({
      topic: 'hasToChooseBoard',
      observerFunction: mockFunction,
    });

    game.executeTurn('5_3');
    game.executeTurn('3_5');
    game.executeTurn('5_4');
    game.executeTurn('4_5');
    game.executeTurn('5_5');

    expect(mockFunction).toHaveBeenCalled();
    expect(game.state.hasToChooseBoard).toBe(true);
    expect(game.state.currentBoardIndex).toBe(null);
  });
});
