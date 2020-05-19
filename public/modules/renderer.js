
import createObserver from './observer.js';


/** @param {Document} document */
function createRenderer(document) {
  const gameArea = document.getElementById('game')
  const subject = createObserver('screenRenderer');

  subject.addTopics('click');
  
  function render(gameState) {
    const { currentBoardIndex, boards } = gameState;
    let button;
    let div;
    // console.log('redering...', currentBoardIndex);

    boards.forEach((board, boardIndex) => {
      div =  document.getElementById(`${boardIndex}`);
      div.classList.remove('currentBoard');
     
      board.fields.forEach((field, fieldIndex) => {
        if (field) {
          const [player] = gameState.players.filter( ({ id }) => id === field);
          button = document.getElementById(`${boardIndex}_${fieldIndex}`);
          button.innerText = player.symbol
          button.classList = player.id
        }
      });
    });

    div = document.getElementById(`${currentBoardIndex}`);
    div.classList.add('currentBoard');
  }

  function initialize(gameState) {
    gameState.boards.forEach((board, boardIndex) => {
      const div = document.createElement('div');
      // é um field ou um board?
      div.classList = 'field';
      div.id = boardIndex;
      
      board.fields.forEach( (field, fieldIndex) => {
        const button = document.createElement('button');

        button.id = `${boardIndex}_${fieldIndex}`
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
    subject,
  }
}

export default createRenderer;