/**
 * interface State {
 *  boards: Board[9];
 *  players: Player[2];
 *  currentPlayer: Player;
 *  currentBoard: Board;
 * }
 * 
 * interface Board {
 *  fields: Array(9);
 *  conqueredBy: string;
 * }
 * 
 * interface Player {
 *  id: string;
 *  symbol: string;
 * }
 * 
 * interface Move {
 *  player: Player;
 *  position: string;
 * } 
 * 
 * 
 * state: {
 *  boards: [
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *    {fields: [9], conqured},
 *  ],
 *  players: [
 *    {id, symbol},
 *    {id, symbol},
 *  ],
 *  currentPlayer: {id, symbol},
 *  currentBoardIndex: number,
 *  subscriptions: {
 *    eventName: Array[]
 *  },
 * }
 * 
 */

/**
 * Topics / topicData
 * 'newMove' / 'coordenada, simbolo'
 * 'conquererBoard' / 'boardIndex, type, simbolo'
 * 'won' / 'type, simbolo' 
 */

import createObserver from './observer.js';

const createGame = () => {
  const state = {};
  state.startedGame = false;
  state.hasToChooseBoard = true;

  const subject = createObserver('game');
  subject.addTopics('newMove', 'conqueredBoard', 'hasToChooseBoard', 'endGame');

  const getInitializedBoard = () => {
    const fields = [];
    const conqueredBy = null;

    for (let i = 0; i < 9; i++){
      fields.push(null);
    }
    
    return {fields, conqueredBy}
  }

  const setUp = () => {
    state.subscriptions = {};
    state.boards = [];

    for (let i = 0; i < 9; i++){
      state.boards.push(getInitializedBoard());
    }

    state.players = []
    state.currentPlayer = null;
  }

  const selectRandomPlayer = () => {
    return state.players[Math.round(Math.random())];
  }

  const makeMove = (position) => {
    const {boardIndex, fieldIndex} = position;
    const board = state.boards[boardIndex];
    const player = state.currentPlayer;

    board.fields[fieldIndex] = player.id;

    const completedSequencesInFields = getCompletedSequences(board.fields);
    console.log('conqueredBoard -->', completedSequencesInFields)
    if (completedSequencesInFields.length) {
      board.conqueredBy = player.id;

      const reshapedBoards = state.boards.map(board => board.conqueredBy)
      const completedSequencesInBoards = getCompletedSequences(reshapedBoards)
      if (completedSequencesInBoards.length) {
        // finishGame()
        console.log('wonGame -->', completedSequencesInBoards)
        subject.notify({topic: 'endGame', topicData: {player, result: 'won'}})
      }
    }

    changePlayer();
    state.currentBoardIndex = fieldIndex;

    subject.notify({ topic: 'newMove', topicData: state })
  }

  const isValidMove = ({playerId, position}) => {
    const {boardIndex, fieldIndex} = position;
    const board = state.boards[boardIndex];
    
    // player
    if (playerId !== state.currentPlayer.id) {
      // implementar: notificar jogador que não é vez dele
      return false
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
  }


  // 'a_b'
  const executeTurn = (position_string) => {
    const playerId = state.currentPlayer.id; // de onde pegar o player ID???
    const [boardIndex, fieldIndex] = position_string.split('_').map(str => parseInt(str));
    const position = { boardIndex, fieldIndex };

    console.log(position, state.currentBoardIndex)

    //se o jogo não comecou qualquer campo é valido para se tornar o campo atual
    if (!state.startedGame) {
      state.currentBoardIndex = boardIndex;
      state.startedGame = true;
    }

    // se o player esta na situação em que deve escolher um campo pra jogar
    // verifique se ele está escolhendo um campo disponivel
    // se sim pode setar esse campo como o atual  
    if (state.hasToChooseBoard) {
      state.hasToChooseBoard = !! state.boards[boardIndex].conqueredBy;
      state.currentBoardIndex = state.hasToChooseBoard ? null : boardIndex;
    }

    if (isValidMove({playerId, position})) {

      makeMove(position) //--{notify}

      //colocar isso aqui na parte do checkThings eu acho
      const futureBoard = state.boards[fieldIndex];
      if (futureBoard.conqueredBy) {
        state.hasToChooseBoard = true;
        console.log('has to choose board:', state.hasToChooseBoard);
        state.currentBoardIndex = null;
        subject.notify({topic: 'hasToChooseBoard', topicData: state});
      }

      // checkThings() //-lembrar de checar se o proximo campo que vai ser jogado já foi conquisado/empatado. Nesse caso o currentFieldIndex vira nulo e o jogador pode escolher qualquer campo
      // changePlayer() 
    }
  }

  const changePlayer = () => {
    const currentPlayerID = state.currentPlayer.id;
    [state.currentPlayer] = state.players.filter(player => player.id !== currentPlayerID);
  }

  const getCompletedSequences = (checkableArray) => {
    let result = [];

    const completedRow = checkRows(checkableArray);
    if (completedRow != -1)
      result.push({type: 'row', index: completedRow})
    
    const completedCol = checkColumns(checkableArray);
    if (completedCol != -1)
      result.push({type: 'column', index: completedCol})
    
    //diferente pois pode acontecer de completar duas diagonais ao mesmo tempo
    const completedDialgonals = checkDiagonals(checkableArray);
    if (completedDialgonals.length)
      result = result.concat( completedDialgonals.map(diag => ({type: 'dialgonal', index: diag})) );
    
    return result;
  }

  const setPlayer = (playerNumber, playerInfo) => {
    state.players[playerNumber] = playerInfo;
  }

  const checkRows = (array) => { 
    for (let row = 0; row <= 6; row += 3)
      if (array[row] && array[row] === array[row+1] && array[row] === array[row+2])
        return row/3; 
    return -1;
  }

  const checkColumns = (array) => { 
    for (let column = 0; column < 3; column++)
      if (array[column] && array[column] === array[column+3] && array[column] === array[column+6])
        return column;
    return -1;
  }

  const checkDiagonals = (array) => { 
    const diagonals = [];

    if (array[4] && array[0] === array[4] && array[4] === array[8])
      diagonals.push(0)
    if (array[4] && array[2] === array[4] && array[4] === array[6])
      diagonals.push(1)
    
    return diagonals;
  }

  return {
    isValidMove,
    state, 
    subject,
    selectRandomPlayer, 
    setPlayer,
    changePlayer,
    setUp, 
    makeMove, 
    executeTurn,
    selectRandomPlayer
  }
}

export default createGame;