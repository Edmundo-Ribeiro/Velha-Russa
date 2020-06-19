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
    game.setPlayer(player0);
    game.setPlayer(player1);
    const expectedPlayers = [player0, player1];
    expect(game.state.players.length).toBe(2);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should not be able to add more than two players', () => {
    const otherPlayer = { id: 'judi beckham', symbol: 'square' };

    game.setPlayer(player0);
    game.setPlayer(player1);
    game.setPlayer(otherPlayer);

    const expectedPlayers = [player0, player1];

    expect(game.state.players.length).toBe(2);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should not be able to add the same player two times', () => {
    game.setPlayer(player0);
    game.setPlayer(player0);

    const expectedPlayers = [player0];

    expect(game.state.players.length).toBe(1);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should not be able to add the player with the same symbol', () => {
    const sameSymbolPlayer = { id: 'The cool yudi', symbol: player0.symbol };
    game.setPlayer(player0);
    game.setPlayer(sameSymbolPlayer);

    const expectedPlayers = [player0];

    expect(game.state.players.length).toBe(1);
    expect(game.state.players).toEqual(expectedPlayers);
  });

  it('Should be able to change players and notify it', () => {
    game.setPlayer(player0);
    game.setPlayer(player1);
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
    game.setPlayer(player0);
    game.setPlayer(player1);
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

  it('Should not be able to make a move if the game ended', () => {
    game.setPlayer(player0);
    game.setPlayer(player1);
    game.state.currentPlayer = player0;

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

    const mockFunction = jest.fn(gameState => gameState);

    game.subject.subscribe({
      topic: 'newMove',
      observerFunction: mockFunction,
    });
    game.executeTurn('0_0');

    expect(game.state.boards[0].fields[0]).toBe(null);
    expect(mockFunction).not.toHaveBeenCalled();
  });
  // it("Should not be able to make a move on the other player's turn", () => {
  //   game.setPlayer( player0);
  //   game.setPlayer( player1);
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
