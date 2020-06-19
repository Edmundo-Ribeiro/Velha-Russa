/**
interface State {
  boards: Board[9];
  players: Player[2];
  currentPlayer: Player;
  currentBoard: Board;
}

interface Board {
  fields: Array(9);
  conqueredBy: string;
}

interface Player {
  id: string;
  symbol: string;
}

interface Move {
  player: Player;
  position: string;
}


state: {
  boards: [
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
    {fields: [9], conqured},
  ],
  players: [
    {id, symbol},
    {id, symbol},
  ],
  currentPlayer: {id, symbol},
  currentBoardIndex: number,
  subscriptions: {
    eventName: Array[]
  },
}

*/

/*
Topics / topicData
'newMove' / 'coordenada, simbolo'
'conquererBoard' / 'boardIndex, type, simbolo'
'won' / 'type, simbolo'
*/

import createObserver from './observer.js';

const createGame = () => {
  const state = {};
  state.startedGame = false;
  state.hasToChooseBoard = true;
  state.ended = false;
  state.gameWinner = null;

  const subject = createObserver('game');
  subject.addTopics(
    'startedGame',
    'newMove',
    'conqueredBoard',
    'tiedBoard',
    'hasToChooseBoard',
    'endGame',
    'changedTurn',
  );

  const getInitializedBoard = () => {
    const fields = [];
    const conqueredBy = null;

    for (let i = 0; i < 9; i += 1) {
      fields.push(null);
    }

    return { fields, conqueredBy };
  };

  const setUp = () => {
    state.boards = [];

    for (let i = 0; i < 9; i += 1) {
      state.boards.push(getInitializedBoard());
    }

    state.players = [];
    state.currentPlayer = null;
  };

  const selectRandomPlayer = () => {
    return state.players[Math.round(Math.random())];
  };

  const changePlayer = () => {
    const currentPlayerID = state.currentPlayer.id;
    [state.currentPlayer] = state.players.filter(
      player => player.id !== currentPlayerID,
    );
    subject.notify({ topic: 'changedTurn', topicData: state.currentPlayer });
  };

  const setPlayer = playerInfo => {
    const duplicatedInfoPlayer = state.players.find(
      player =>
        playerInfo.id === player.id || playerInfo.symbol === player.symbol,
    );

    if (state.players.length < 2 && !duplicatedInfoPlayer) {
      state.players.push(playerInfo);
    } else {
      console.error(
        'Is not possible to add more than two players or repeat info of another player',
      ); // transform console.error into throw
    }
  };

  const makeMove = position => {
    const { boardIndex, fieldIndex } = position;
    const board = state.boards[boardIndex];
    const player = state.currentPlayer;

    board.fields[fieldIndex] = player.id;
    state.currentBoardIndex = fieldIndex;
  };

  const isValidMove = ({ playerId, position }) => {
    const { boardIndex, fieldIndex } = position;
    const board = state.boards[boardIndex];

    // se o jogo acabou, não pode mais jogar
    if (state.ended) {
      return false;
    }
    // player
    if (playerId !== state.currentPlayer.id) {
      // implementar: notificar jogador que não é vez dele
      return false;
    }

    // se campo tá ativo, "é válido"
    if (state.currentBoardIndex !== boardIndex) {
      return false;
    }

    // se o campo não consquistado
    if (board.conqueredBy) {
      return false;
    }

    // quadrado não tá marcado
    if (board.fields[fieldIndex]) {
      return false;
    }

    return true;
  };

  const checkRows = array => {
    for (let row = 0; row <= 6; row += 3)
      if (
        array[row] &&
        array[row] === array[row + 1] &&
        array[row] === array[row + 2] &&
        array[row] !== 'tie'
      )
        return row / 3;
    return -1;
  };

  const checkColumns = array => {
    for (let column = 0; column < 3; column += 1)
      if (
        array[column] &&
        array[column] === array[column + 3] &&
        array[column] === array[column + 6] &&
        array[column] !== 'tie'
      )
        return column;
    return -1;
  };

  const checkDiagonals = array => {
    const diagonals = [];

    if (
      array[4] &&
      array[0] === array[4] &&
      array[4] === array[8] &&
      array[4] !== 'tie'
    )
      diagonals.push(0);
    if (
      array[4] &&
      array[2] === array[4] &&
      array[4] === array[6] &&
      array[4] !== 'tie'
    )
      diagonals.push(1);

    return diagonals;
  };

  const checkTie = ({ completedSequencesResult, checkableArray }) => {
    if (completedSequencesResult.length) {
      return false;
    }

    const remainingNullElement = checkableArray.includes(null);

    return !remainingNullElement;
  };

  const getCompletedSequences = checkableArray => {
    let result = [];

    const completedRow = checkRows(checkableArray);
    if (completedRow !== -1) result.push({ type: 'row', index: completedRow });

    const completedCol = checkColumns(checkableArray);
    if (completedCol !== -1)
      result.push({ type: 'column', index: completedCol });

    // diferente pois pode acontecer de completar duas diagonais ao mesmo tempo
    const completedDiagonals = checkDiagonals(checkableArray);
    if (completedDiagonals.length)
      result = result.concat(
        completedDiagonals.map(diag => ({ type: 'diagonal', index: diag })),
      );

    return result;
  };

  const endGame = ({ player, result }) => {
    state.ended = true;
    subject.notify({
      topic: 'endGame',
      topicData: { player, result },
    });
  };

  const checkForBoardConquerOrTie = boardIndex => {
    const player = state.currentPlayer;
    const board = state.boards[boardIndex];

    const completedSequences = getCompletedSequences(board.fields);
    if (completedSequences.length) {
      console.log('completedSequencesInFields', completedSequences);

      board.conqueredBy = player.id;
      subject.notify({ topic: 'conqueredBoard', topicData: boardIndex });
      return 'conqueredBoard';
    }
    const tie = checkTie({
      completedSequencesResult: completedSequences,
      checkableArray: board.fields,
    });

    if (tie) {
      board.conqueredBy = 'tie';
      subject.notify({ topic: 'tiedBoard', topicData: boardIndex });
      return 'tiedBoard';
    }

    return 'nothing';
  };

  const checkForGameWinnerOrTie = () => {
    const reshapedBoards = state.boards.map(
      boardToReshape => boardToReshape.conqueredBy,
    );

    const completedSequences = getCompletedSequences(reshapedBoards);

    if (completedSequences.length) {
      console.log('completedSequencesInBoards', completedSequences);

      state.gameWinner = state.currentPlayer.id;
      endGame({
        player: state.gameWinner,
        result: 'won',
      });

      return 'won';
    }

    const gameTie = checkTie({
      completedSequencesResult: completedSequences,
      checkableArray: reshapedBoards,
    });

    if (gameTie) {
      endGame({
        player: state.currentPlayer,
        result: 'tied',
      });
      return 'tied';
    }

    return 'nothing';
  };

  const checkIfWillHaveToChooseBoard = futureBoardIndex => {
    const futureBoard = state.boards[futureBoardIndex];
    if (futureBoard.conqueredBy) {
      state.hasToChooseBoard = true;
      state.currentBoardIndex = null;
      subject.notify({ topic: 'hasToChooseBoard', topicData: true });
    }
  };
  //   const checkForGameWinnerOrTie = boardIndex => {
  //   const { boardIndex } = position;
  //   const board = state.boards[boardIndex];
  //   const player = state.currentPlayer;

  //   const completedSequencesInFields = getCompletedSequences(board.fields);

  //   if (completedSequencesInFields.length) {
  //     console.log('completedSequencesInFields', completedSequencesInFields);
  //     board.conqueredBy = player.id;
  //     subject.notify({ topic: 'conqueredBoard', topicData: boardIndex });

  //     const reshapedBoards = state.boards.map(
  //       boardToReshape => boardToReshape.conqueredBy,
  //     );
  //     const completedSequencesInBoards = getCompletedSequences(reshapedBoards);
  //     console.log('completedSequencesInBoards', completedSequencesInBoards);
  //     if (completedSequencesInBoards.length) {
  //       endGame({
  //         player: state.currentPlayer,
  //         result: 'won',
  //       });

  //       console.log('wonGame -->', completedSequencesInBoards);
  //     }
  //   }
  // };

  const dealWithMovementImplications = position => {
    const { boardIndex, fieldIndex } = position;

    const whatHappenedToTheBoard = checkForBoardConquerOrTie(boardIndex);

    // if nothing happened to the board
    if (whatHappenedToTheBoard === 'nothing') {
      changePlayer(); // change the current player
      checkIfWillHaveToChooseBoard(fieldIndex); // check if the player will have to choose a board
      return; // continue
    }

    const whatHappenedToTheGame = checkForGameWinnerOrTie();
    if (whatHappenedToTheGame === 'nothing') {
      changePlayer();
      checkIfWillHaveToChooseBoard(fieldIndex);
    }
  };

  const executeTurn = positionString => {
    const playerId = state.currentPlayer.id; // de onde pegar o player ID???
    const [boardIndex, fieldIndex] = positionString
      .split('_')
      .map(str => parseInt(str, 10));
    const position = { boardIndex, fieldIndex };

    // if the game did not started, any board is available to turn into the current board
    if (!state.startedGame) {
      state.currentBoardIndex = boardIndex;
      state.startedGame = true;
      subject.notify({ topic: 'startedGame' });
    }

    // if the player is in the situation of "has to choose a board"
    if (state.hasToChooseBoard) {
      state.hasToChooseBoard = !!state.boards[boardIndex].conqueredBy; // verify if the board that he is choosing is available
      state.currentBoardIndex = state.hasToChooseBoard ? null : boardIndex; // if it is available, it can be set as the current board
    }

    // if the move informed is valid
    if (isValidMove({ playerId, position })) {
      makeMove(position); // it can be made

      dealWithMovementImplications(position); // the implications of that movement are dealt
      subject.notify({ topic: 'newMove', topicData: state }); // notify that a new movement was made
    }
  };

  return {
    state,
    subject,
    isValidMove,
    selectRandomPlayer,
    setPlayer,
    changePlayer,
    setUp,
    makeMove,
    executeTurn,
  };
};

export default createGame;
