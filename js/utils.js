function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
  }
  
  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    const displayText = document.querySelector('#displayText');
    displayText.style.display = 'flex';
    displayText.style.color = 'red'; 
    displayText.style.fontSize = '50px'; 
    if (player.health === enemy.health) {
      displayText.innerHTML = 'Tie';
    } else if (player.health > enemy.health && player.health !== 100) {
      displayText.innerHTML = 'KO ! Player WIN';
    } else if (player.health < enemy.health && enemy.health !== 100) {
      displayText.innerHTML = 'KO ! Enemy WIN';
    }
    else if(player.health > enemy.health && player.health === 100) {
      displayText.style.color='yellow';
      displayText.innerHTML = 'PERFECT ! Player WIN';
    }
    else if(player.health < enemy.health && enemy.health === 100) {
      displayText.style.color='yellow';
      displayText.innerHTML = 'PERFECT ! Enemy WIN';
    }
  }
  
  let timer = 60;
  let timerId;
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector('#timer').innerHTML = timer;
    }
  
    if (timer === 0) {
      determineWinner({ player, enemy, timerId });
    }
  }