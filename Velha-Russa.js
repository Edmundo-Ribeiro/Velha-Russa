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


const createGame = () => {
  const state = {};
  const observer = createObserver('game');
  observer.addTopics('newMove', 'conqueredBoard');

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
    const [boardIndex, fieldIndex] = position.split('_');
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
      }
    }

    changePlayer();
    state.currentBoard = fieldIndex; 

    observer.notify({topic: 'newMove', topicData: state} )
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
    state, 
    observer,
    selectRandomPlayer, 
    setPlayer,
    changePlayer,
    setUp, 
    makeMove, 
    selectRandomPlayer
  }
}
