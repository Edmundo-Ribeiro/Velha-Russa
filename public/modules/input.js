import createObserver from './observer.js';

/**
 * @param {Document} document
 */
function createClickInput(document) {
  const game = document.getElementById('game');
  const subject = createObserver('input');

  subject.addTopics('click');

  const initialize = () => {
    const boards = game.childNodes;

    boards.forEach(board => {
      board.childNodes.forEach(button => {
        button.onclick = () =>
          subject.notify({ topic: 'click', topicData: button.id })
      });
    });
  }

  return {
    subject,
    initialize
  }
}

export default createClickInput
