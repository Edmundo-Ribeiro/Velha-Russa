import createObserver from './observer.js';


/** @param {Document} document */
function createRenderer(document) {
  const gameArea = document.getElementById('game')
  const subject = createObserver('screenRenderer');

  subject.addTopics('click');

  const renderField = ({ id, content, isAvailable, isConquered }) => {
      const button = document.getElementById(id);
      const img = document.getElementById(`img_${id}`);

      if (content) {
        img.src = `../assets/${content}-${isConquered ? 'inactive' : 'active'}.svg`;
      }

      if (isAvailable ) {
        button.classList.add('available');
      }
      else {
        button.classList.remove('available');
      }

  }
  const renderBoard = ({board, boardIndex, players, isCurrent, hasToChooseBoard }) => {
    const div = document.getElementById(`${boardIndex}`);
    let player;

    isCurrent || hasToChooseBoard
      ? div.classList.add('currentBoard')
      : div.classList.remove('currentBoard');

    board.fields.forEach( (field, fieldIndex) => {
      [player] = players.filter( ({ id }) => id === field);

      renderField({
        content: player?.symbol,
        id: `${boardIndex}_${fieldIndex}`,
        isAvailable: (isCurrent || hasToChooseBoard) && !board.conqueredBy,
        isConquered: !!board.conqueredBy,
      });
    });

    if (board.conqueredBy) {
      div.classList.add('conquered');
      [player] = players.filter( ({ id }) => id === board.conqueredBy);

      if (player.symbol === 'x'){
        div.style.border = '0.5px solid #D01717';
      }
      else if (player.symbol === 'circle'){
        div.style.border = '0.5px solid #005AFF';
      }

    }
  }
  const render = (gameState) => {
    const {boards, players, currentBoardIndex, hasToChooseBoard} = gameState;

    boards.forEach((board, boardIndex) => renderBoard({
      board,
      boardIndex,
      isCurrent: (currentBoardIndex === boardIndex),
      players,
      hasToChooseBoard
    }));
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
      div.classList = 'board';

      div.id = boardIndex;

      board.fields.forEach((field, fieldIndex) => {
        const button = document.createElement('button');

        button.id = `${boardIndex}_${fieldIndex}`
        button.onclick = () => clicked(coordinates)
        button.innerHTML= `<img id="img_${boardIndex}_${fieldIndex}" src="../assets/empity.svg"/>`;


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
    subject,
    endedGame,
    renderBoard
  }
}

export default createRenderer;
