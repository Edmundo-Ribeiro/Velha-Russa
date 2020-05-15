/** @param {Document} document */
function createScreen(document) {
  const gameArea = document.getElementById('game')

  function render(gameState) {
    const {currentBoard, boards} = gameState;
    let button;
    let div;
    console.log('redering...');
    boards.forEach( (board, boardIndex) => {
      div =  document.getElementById(`${boardIndex}`);
      div.classList.remove('currentBoard');
     
      board.fields.forEach( (field, fieldIndex) => {
        if(field){
          const [player] = gameState.players.filter( ({ id }) => id === field);
          button = document.getElementById(`${boardIndex}_${fieldIndex}`);
          button.innerText = player.symbol
        }
      });
      
    });
    div =  document.getElementById(`${currentBoard}`);
    div.classList.add('currentBoard')
    
  }

  function clicked(coordinates) {
    console.log(coordinates);
    if(coordinates.boardIndex == game.state.currentBoard ){
      game.makeMove(`${coordinates.boardIndex}_${coordinates.fieldIndex}`);
    }
  }

  function initialize(gameState) {

    gameState.boards.forEach( (board, boardIndex) => {
      const div = document.createElement('div');
      div.classList = 'field';
      div.id = boardIndex;
      
      board.fields.forEach( (field, fieldIndex) => {
        const button = document.createElement('button');
        const coordinates = {boardIndex, fieldIndex}

        button.id = `${boardIndex}_${fieldIndex}`
        button.onclick = () => clicked(coordinates)
        button.innerText = ''
        
        div.append(button);
      });

      gameArea.append(div);
    });
  }

  return {
    gameArea,
    initialize,
    render,
  }
}
