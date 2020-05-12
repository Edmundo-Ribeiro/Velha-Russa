/** @param {Document} document */
function createScreen(document) {
  const gameArea = document.getElementById('game')
  
  // function renderScreen(gameState) {
  // }

  function clicked(coordinates) {
    console.table(coordinates);
  }

  function initializeScreen(gameState) {

    for (let [fieldKey, field] of Object.entries(gameState.fields)) {
      const div = document.createElement('div');
      div.classList = 'field'
      div.id = fieldKey
      
      for (let [littleSquareKey, littleSquare] of Object.entries(field)) {
        if (littleSquareKey === 'conqueredBy')
          continue

        const button = document.createElement('button');

        const coordinates = {fieldKey, littleSquareKey}
        button.onclick = () => clicked(coordinates)
        // button.innerText = `${fieldKey}:${littleSquareKey}`
        button.innerText = ''
        
        div.append(button);
      }

      gameArea.append(div);
    }

    // for (let fieldKey in gameState.fields) {
    //   const field = gameState.fields[fieldKey]

    //   for (let littleSquare in field) {
    //     const button = document.createElement('button');

    //     const coordinates = {field: fieldKey, littleSquare}
    //     button.onclick = () => clicked(coordinates)
    //     button.innerText = `${fieldKey}:${littleSquare}`
        
    //     gameArea.append(button);
    //   } 
    // }  
  }

  return {
    gameArea,
    initializeScreen
  }
}
