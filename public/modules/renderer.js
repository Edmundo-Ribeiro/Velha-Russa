import createObserver from './observer.js';


/** @param {Document} document */
function createRenderer(document) {
  const gameArea = document.getElementById('game')
  const subject = createObserver('screenRenderer');
  
  subject.addTopics('click');
  
  //refatorar totalmente essa função!
  function render(gameState) {
    const { currentBoardIndex, boards, hasToChooseBoard } = gameState;
    let button;
    let div;
    console.log('redering...');
    
    boards.forEach((board, boardIndex) => {
      div = document.getElementById(`${boardIndex}`);
      
      boardIndex === currentBoardIndex 
        ? div.classList.add('currentBoard') 
        : div.classList.remove('currentBoard');
      
      if (hasToChooseBoard && !board.conqueredBy) {
        div.classList.add('currentBoard');
      }
      
      board.fields.forEach((field, fieldIndex) => {
        button = document.getElementById(`${boardIndex}_${fieldIndex}`);

        if (field) {
          const [player] = gameState.players.filter(({ id }) => id === field);
          button.innerText = player.symbol
          button.classList.remove('available');
          button.classList.add(player.id) // essa linha vai ser executada mais de uma vez?
        }
        else if ((boardIndex === currentBoardIndex || hasToChooseBoard) && !board.conqueredBy) {
          button.classList.add('available');
        }
        else {
          button.classList.remove('available');
        }
      });
      
      if (board.conqueredBy) {
        div.classList.add('conquered');
      }
    });
  }
  
  function endedGame({player, result}) {
    if (result === 'won'){
      alert(`${player.symbol} won the game`);
    }
    else{
      alert(`${player.symbol} tied the game`);
    }
  }
  
  function initialize(gameState) {
    gameState.boards.forEach((board, boardIndex) => {
      const div = document.createElement('div');
      // é um field ou um board?
      div.classList = 'field';
      // acho melhor deixar essa id mais descritiva. Ex: `boardIndex_${boardIndex}`
      div.id = boardIndex;
      
      board.fields.forEach((field, fieldIndex) => {
        const button = document.createElement('button');
        
        button.id = `${boardIndex}_${fieldIndex}`
        button.innerText = ''
        
        div.append(button);
      });
      
      gameArea.append(div);
    });
    
    console.log('Choose a field in any of the boards!');
  }
  
  return {
    gameArea,
    subject,
    initialize,
    render,
    endedGame
  }
}

export default createRenderer;