function createGame() {
  const state = {}
 
  const initializedField = () => {
    const field = {};
    for (let index = 0; index < 9; index++){ 
      field[index] = null;
    }
    
    field.conqueredBy = null;
    // field.info.conqueredBy = null;
    
    return field;
  }

  const initializeState = () => {
    state.fields = {}

    for (let fieldIndex = 0; fieldIndex < 9; fieldIndex++){
      state.fields[fieldIndex] = initializedField();
    }
    
    state.players = {
      player1: {
        id: null,
        symbol: 'X',
      },
      player2: {
        id: null,
        symbol: 'O',
      },
    }

    state.currentPlayer = state.players[`player${Math.round(Math.random()+1)}`];
  }
  
  const validateMove = ({ playerId, position }) => {
    if (state.currentPlayer !== playerId ) {
      throw new Error('invalid');
    }
  }

  const makeMove = ({ player, position }) => {
    // refatorar pra nomes melhores
    const [fieldKey, littleSquareKey] = String(position).split('_')
    const field = state.fields[fieldKey]
    
    state.fields[fieldKey][littleSquareKey] = player.symbol

    const conquered = checkForConqueredField(field)

    if (conquered) {
      field.conqueredBy = player.id
      const wintype = checkForGameWinner()
    }
  }

  const checkForGameWinner = () => {
    const game = {}

    Object
      .entries(state.fields)
      .forEach(([key, value]) => 
        game[key] = value.conqueredBy
      )

    const result = checkForConqueredField(game)
    console.log(result)
  }

  // checkForCompletedField?
  const checkForConqueredField = (field) => {
    const column = checkColumns(field)
    if (column > -1) {
      return {type: 'column', column}
    }

    const row = checkRows(field)
    if (row > -1) {
      return {type: 'row', row}
    }

    const diagonal = checkDiagonals(field)
    if (diagonal > -1) {
      return {type: 'diagonal', diagonal}
    }

    return false
  }

  const checkColumns = (field) => {
    const columns = [
      field[0] === field[3] && field[3] === field[6] && field[3],
      field[1] === field[4] && field[4] === field[7] && field[4],
      field[2] === field[5] && field[5] === field[8] && field[5],
    ]

    const result = columns.findIndex(column => column)
    
    return result
  }

  const checkRows = (field) => {
    const rows = [
      field[0] === field[1] && field[1] === field[2] && field[1],
      field[3] === field[4] && field[4] === field[5] && field[4],
      field[6] === field[7] && field[7] === field[8] && field[7],
    ]

    const result = rows.findIndex(row => row)
    
    return result
  }

  const checkDiagonals = (field) => {
    const diagonals = [
      field[0] === field[4] && field[4] === field[8] && field[4],
      field[2] === field[4] && field[4] === field[6] && field[4],
    ]

    const result = diagonals.findIndex(diagonal => diagonal)
    
    return result
  }

  return {
    state,
    initializeState,
    makeMove,
  }
}
