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
  
  const validateMove = ({playerId, position}) => {
    if (state.currentPlayer !== playerId ) {
      throw new Error('invalid');
    }
  }

  const makeMove = ({playerId, position}) => {
    // refatorar pra nomes melhores
    const [big, small] = String(position).split(':')
    
    state[big][small] = playerId

    notifyAll({
      type: 'make-move',
      playerId,
      position,
    })
  }

  return {
    state,
    initializeState,
    // makeMove,
  }



  const checkWin = () => {

  }

  const checkRow = () => {
    
  }
}
