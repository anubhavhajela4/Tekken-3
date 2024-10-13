const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

//c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.8


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: '../assets/player/Idle.png',
    framesMax: 10,
    scale: 2.5,
    offset: {
        x: 0,
        y: 100
    },
    sprites: {
        idle: {
            imageSrc: '../assets/player/Idle.png',
            framesMax: 10
        },
        run: {
            imageSrc: '../assets/player/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '../assets/player/Jump.png',
            framesMax: 3
        },
        fall: {
            imageSrc: '../assets/player/Fall.png',
            framesMax: 3
        },
        attack1: {
            imageSrc: '../assets/player/Attack1.png',
            framesMax: 7
        },
        takeHit: {
            imageSrc: '../assets/player/Take_Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: '../assets/player/Death.png',
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 100
    },
    imageSrc: '../assets/enemy/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 0,
        y: 130
    },
    sprites: {
        idle: {
            imageSrc: '../assets/enemy/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: '../assets/enemy/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: '../assets/enemy/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: '../assets/enemy/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: '../assets/enemy/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: '../assets/enemy/Take_Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: '../assets/enemy/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    }
})
//console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

//decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
//   c.fillStyle = 'black'
//   c.fillRect(0, 0, canvas.width, canvas.height)
//   c.fillStyle = 'rgba(255, 255, 255, 0.15)'
//   c.fillRect(0, 0, canvas.width, canvas.height)
c.clearRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -20
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -20
        break
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
});