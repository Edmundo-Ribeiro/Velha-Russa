/** @param {Document} document */
function createScreen(document) {
  const gameArea = document.getElementById('game')

  function render(gameState) {
    let button;

    gameState.boards.forEach( (board, boardIndex) => {
      board.fields.forEach( (field, fieldIndex) => {
        if(field){
          const [player] = gameState.players.filter( ({ id }) => id === field);
          button = document.getElementById(`${boardIndex}_${fieldIndex}`);
          button.innerText = player.symbol
        }
      });
    });

    requestAnimationFrame(() => render(gameState))
  }

  function clicked(coordinates) {
    console.log(coordinates);
    game.makeMove({player,position: coordinates});
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
        button.onclick = () => clicked(button.id)
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
