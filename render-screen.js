/** @param {Document} document */
function createScreen(document) {
  const gameArea = document.getElementById('game')

  function render(gameState) {
    let button;

    for (let [fieldKey, field] of Object.entries(gameState.fields)) {
      for (let [littleSquareKey, littleSquare] of Object.entries(field)) {
        if (littleSquareKey === 'conqueredBy')
          continue

        button = document.getElementById(`${fieldKey}_${littleSquareKey}`)

        button.innerText = littleSquare
      }
    }

    requestAnimationFrame(() => render(gameState))
  }

  function clicked(coordinates) {
    // console.table(coordinates);
  }

  function initialize(gameState) {
    for (let [fieldKey, field] of Object.entries(gameState.fields)) {
      const div = document.createElement('div');
      div.classList = 'field'
      div.id = fieldKey
      
      for (let [littleSquareKey, _] of Object.entries(field)) {
        if (littleSquareKey === 'conqueredBy')
          continue

        const button = document.createElement('button');

        const coordinates = {fieldKey, littleSquareKey}
        button.onclick = () => clicked(coordinates)
        button.id = `${fieldKey}_${littleSquareKey}`
        button.innerText = ''
        
        div.append(button);
      }

      gameArea.append(div);
    }
  }

  return {
    gameArea,
    initialize,
    render,
  }
}
