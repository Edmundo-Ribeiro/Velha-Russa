/**
 * interface State {
 *  boards: Board[9];
 *  players: Player[2];
 *  currentPlayer: Player;
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
 *  currentPlayer: {id, symbol}
 * }
 * 
 */

const createGame = () => {
  const state = {};

  const initializeBoard = () => {
    const fields = [];
    const conqueredBy = null;

    for (let i = 0; i < 9; i++){
      fields.push(null);
    }
    return {fields, conqueredBy}
  }

  const initialize = () => {
    state.boards = [];
    for (let i = 0; i < 9; i++){
      state.boards.push(initializeBoard());
    }

    state.players = [
     { id: null, symbol: 'X' },
     { id: null, symbol: 'O',}
    ]

    state.currentPlayer = null;
  }

  const selectRandomPlayer = (players) => {
    return players[Math.round(Math.random())];
  }
 
  const makeMove = ({player, position}) => {
    const [boardIndex, fieldIndex] = position.split('_');
    const board = state.boards[boardIndex];

    board.fields[fieldIndex] = player.id;

    const conqueredBoard = sequenceCompleted(board.fields);
    console.log('conqueredBoard -->', conqueredBoard)
    if (conqueredBoard.length) {
      board.conqueredBy = player.id;

      const conqueredStatus = state.boards.map(board => board.conqueredBy)
      const wonGame = sequenceCompleted(conqueredStatus)
      if (wonGame.length) {
        console.log('wonGame -->', wonGame)
      }
    }

    // state.currentPlayer = 

  }

  const sequenceCompleted = (checkableArray) => {
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

  const checkRows = (array) => { 
    for (let row = 0; row <= 6; row+=3)
       if (array[row] && array[row] === array[row+1] && array[row] === array[row+2])
        return row/3;
    return -1;
  }

  const checkColumns = (array) => { 
    for (let col = 0; col < 3; col++)
       if (array[col] && array[col] === array[col+3] && array[col] === array[col+6])
         return col;
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

  return { state, initialize, makeMove, selectRandomPlayer}
}
