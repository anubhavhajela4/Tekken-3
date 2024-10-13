const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1300;
canvas.height = 600;
const gravity = 0.2;
class Sprite {
    constructor({position,imageSrc,scale=1,framesMax=1,offset={x:0,y:0}})   {
        this.position = position ;
        this.width=50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale=scale;
        this.framesMax=framesMax;
        this.framesCurrent=0;
        this.framesElapsed=0;
        this.framesHold=1;
        this.offset=offset
    }
    draw () {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width /this.framesMax),
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x-this.offset.x,
            this.position.y-this.offset.y,
            (this.image.width/this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }
    animateFrames () {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold ===0) {
        if(this.framesCurrent < this.framesMax -1) {
        this.framesCurrent++;
        }
        else {
            this.framesCurrent=0;
        }
    }
    }
    update() {
        this.draw();
        this.animateFrames();
    }
}
class Fighter extends Sprite {
    constructor({position,velocity,color='red', imageSrc,scale=1,framesMax=1,offset={x:0,y:0}})   {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        });
        this.velocity = velocity ;
        this.width=50;
        this.height = 150;
        this.lastKey;
        this.attackBox= {
            position:{
                x:this.position.x,
                y:this.position.y
            },
            offset :offset,
            width:100,
            height:50
        } ;
        this.color=color;
        this.isAttacking;
        this.health=100;
        this.framesCurrent=0;
        this.framesElapsed=0;
        this.framesHold=6;
    }

    update() {
        this.draw();
        this.animateFrames();
        this.attackBox.position.x=this.position.x+this.attackBox.offset.x;
        this.attackBox.position.y=this.position.y;
        this.position.x+=this.velocity.x;
        this.position.y +=this.velocity.y;
        if(this.position.y+this.height+this.velocity.y >= canvas.height) {
            this.velocity.y=0;
        }
        else
        this.velocity.y+=gravity;
    }
    attack () {
        this.isAttacking=true;
        setInterval(()=>{
            this.isAttacking=false;
        },100)
    }
}

const player = new Fighter ( {
    position: {
    x:0,
    y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc:'../assets/player/Idle.png',
    framesMax:10,
    scale:3,
    offset: {
        x:0,
        y:130
    }
});

const enemy = new Fighter ( {
    position: {
    x:400,
    y:100
    },
    velocity: {
        x:0,
        y:0
    },
    color:'blue',
    offset: {
        x:-50,
        y:0
    }
});

const keys = {
    a: {
        pressed:false
    },
    d: {
        pressed:false
    },
    w: {
        pressed:false
    },
    ArrowLeft: {
        pressed:false
    },
    ArrowRight: {
        pressed:false
    }
}
//added rectangle collision detection
function rectangularCollision ({
    rectangle1,rectangle2
}) {
    return (
        rectangle1.attackBox.position.x+rectangle1.attackBox.width>=rectangle2.position.x && 
        rectangle1.attackBox.position.x<=rectangle2.position.x+rectangle2.width &&
        rectangle1.attackBox.position.y+rectangle1.attackBox.height>=rectangle2.position.y&&
        rectangle1.attackBox.position.y<=rectangle2.position.y+rectangle2.height
    )
}

function animate () {
    window.requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    // enemy.update();
    player.velocity.x=0;
    enemy.velocity.x=0;
    //player movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x=-5;
    }
    else if(keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x=5;
    }
    //enemy movement
    if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x=5;
    }
    else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x=-5;
    }
    //attack collision detection
    if(rectangularCollision({
        rectangle1:player,
        rectangle2:enemy
    }) &&
        player.isAttacking) {
            player.isAttacking=false;
            enemy.health-=10;
            document.querySelector('#enemyHealth').style.width = enemy.health +'%';
        }

        if(rectangularCollision({
            rectangle1:enemy,
            rectangle2:player
        }) && 
            enemy.isAttacking) {
                enemy.isAttacking=false;
                player.health-=10;
                document.querySelector('#playerHealth').style.width = player.health +'%';
            }
        //end game based on health
        if(player.health<=0 || enemy.health<=0) {
            determineWinner({player,enemy,timerId});
        }
}

function determineWinner({player,enemy,timerId}) {   
    clearTimeout(timerId); 
    if(player.health===enemy.health ) {
        document.querySelector('#displayText').innerHTML='Tie';
        document.querySelector('#displayText').style.display='flex';
    }
    else if(player.health>enemy.health ) {
        document.querySelector('#displayText').innerHTML='KO! Player Wins';
        document.querySelector('#displayText').style.display='flex';
    }
    else if(enemy.health>player.health ) {
        document.querySelector('#displayText').innerHTML='KO! Enemy Wins';
        document.querySelector('#displayText').style.display='flex';
    }
}
let timer =60;
let timerId;
function decreaseTimer() {
    if(timer>0) {
    timerId = setTimeout(decreaseTimer,1000);
    timer--;
    document.querySelector('#timer').innerHTML=timer;
    }
    if(timer ===0) {
        determineWinner({player,enemy,timerId});
    }
}
decreaseTimer();

animate();
window.addEventListener('keydown',(event)=> {
    switch(event.key) {
        case 'd' :
        keys.d.pressed=true;
        player.lastKey ='d';
        break;
        case 'a' :
        keys.a.pressed=true;
        player.lastKey='a';
        break;
        case 'w' :
        player.velocity.y=-10;
        break;
        case ' ':
        player.attack();
        break;

        case 'ArrowRight' :
        keys.ArrowRight.pressed=true;
        enemy.lastKey ='ArrowRight';
        break;
        case 'ArrowLeft' :
        keys.ArrowLeft.pressed=true;
        enemy.lastKey='ArrowLeft';
        break;
        case 'ArrowUp' :
        enemy.velocity.y=-10;
        break;
        //enemy gonna attack whenever we press down arrow key
        case 'ArrowDown' :
        enemy.attack();
        break; 
    }
});

window.addEventListener('keyup',(event)=> {
    switch(event.key) {
        case 'd' :
        keys.d.pressed=false;
        break;
        case 'a' :
        keys.a.pressed=false;
        break;
    }
    switch(event.key) {
        case 'ArrowRight' :
        keys.ArrowRight.pressed=false;
        break;
        case 'ArrowLeft' :
        keys.ArrowLeft.pressed=false;
        break;
    }
});