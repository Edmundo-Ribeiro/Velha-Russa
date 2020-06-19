import createGame from '../game.js';

let game;
const player0 = { id: 'david beckham', symbol: 'circle' };
const player1 = { id: 'yudi beckham', symbol: 'x' };

describe('Possible game states', () => {
  beforeEach(() => {
    game = createGame();
    game.setUp();
  });

  it('Should be able to add players and notify it', () => {
    game.setPlayer(0, player0);
    game.setPlayer(1, player1);
    const expectedPlayers = [player0, player1];
    expect(game.state.players.length).toBe(2);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should not be able to add more than two players', () => {
    const otherPlayer = { id: 'judi beckham', symbol: 'square' };

    game.setPlayer(0, player0);
    game.setPlayer(1, player1);
    game.setPlayer(2, otherPlayer);

    const expectedPlayers = [player0, player1];

    expect(game.state.players.length).toBe(2);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should not be able to add the same player two times', () => {
    game.setPlayer(0, player0);
    game.setPlayer(1, player0);

    const expectedPlayers = [player0];

    expect(game.state.players.length).toBe(1);
    expect(game.state.players).toEqual(expectedPlayers);
  });
  it('Should be able to change players and notify it', () => {
    game.setPlayer(0, player0);
    game.setPlayer(1, player1);
    game.state.currentPlayer = player0;

    const mockFunction = jest.fn(player => player);

    game.subject.subscribe({
      topic: 'changedTurn',
      observerFunction: mockFunction,
    });
    game.executeTurn('4_4');

    expect(game.state.currentPlayer).toEqual(player1);
    expect(mockFunction).toHaveBeenCalled();
  });
  it('Should be able to make a move on its turn and notify it', () => {
    game.setPlayer(0, player0);
    game.setPlayer(1, player1);
    game.state.currentPlayer = player0;

    const mockFunction = jest.fn(gameState => gameState);

    game.subject.subscribe({
      topic: 'newMove',
      observerFunction: mockFunction,
    });
    game.executeTurn('4_4');

    expect(game.state.boards[4].fields[4]).toBe(player0.id);
    expect(mockFunction).toHaveBeenCalled();
  });
  // it("Should not be able to make a move on the other player's turn", () => {
  //   game.setPlayer(0, player0);
  //   game.setPlayer(1, player1);
  //   game.state.currentPlayer = player0;

  //   const makeMove = jest.spyOn(game, 'makeMove');
  //   const mockFunction = jest.fn(gameState => gameState);

  //   game.subject.subscribe({
  //     topic: 'newMove',
  //     observerFunction: mockFunction,
  //   });
  //   game.executeTurn('4_4');

  //   expect(makeMove).not.toHaveBeenCalled();
  //   expect(mockFunction).not.toHaveBeenCalled();

  // });
});
