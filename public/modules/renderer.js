
import createObserver from './observer.js';


/** @param {Document} document */
function createRenderer(document) {
  const gameArea = document.getElementById('game')
  const subject = createObserver('screenRenderer');

  subject.addTopics('click');
  
  //refatorar totalmente essa função!
  function render(gameState) {
    const {currentBoardIndex, boards, hasToChooseBoard} = gameState;
    let button;
    let div;
    console.log('redering...');
    
    boards.forEach( (board, boardIndex) => {
      div = document.getElementById(`${boardIndex}`);

      boardIndex === currentBoardIndex 
        ? div.classList.add('currentBoard') 
        : div.classList.remove('currentBoard');
      
      if (hasToChooseBoard && !board.conqueredBy) {
        div.classList.add('currentBoard');
      }

      board.fields.forEach( (field, fieldIndex) => {
        button = document.getElementById(`${boardIndex}_${fieldIndex}`);
        if (field) {
          const [player] = gameState.players.filter( ({ id }) => id === field);
          button.innerText = player.symbol
          button.classList.remove('avaliable');
        }
        else if ((boardIndex === currentBoardIndex || hasToChooseBoard) && !board.conqueredBy ) {
          button.classList.add('avaliable');
        }
        else {
          button.classList.remove('avaliable');
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

  function clicked(coordinates) {
    console.log('You clicked on:', coordinates);
    const position =`${coordinates.boardIndex}_${coordinates.fieldIndex}` 
    subject.notify({topic: 'click', topicData: position })
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

    console.log('Choose a field in any of the boards!');
  }

  return {
    initialize,
    render,
    subject,
    endedGame
  }
}

export default createRenderer;