// select canvas
const canvas = document.getElementById('pong');
const ctx=canvas.getContext("2d");

// Paddle of user&computer
const user={
    x:0,
    y:canvas.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score:0
}
const com={
    x:canvas.width-10,
    y:canvas.height/2-100/2,
    width:10,
    height:100,
    color:"white",
    score:0
}
const net={
    x:canvas.width/2-1,
    y:0,
    width:2,
    height:10,
    color:"white"
}


// create the ball
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    radius:10,
    speed:5,
    velocityX:5,
    velocityY:5,
    color:"white"
}

function drawRect(x,y,w,h,color){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}


function drawNet(){
    for(let i=0;i<=canvas.height;i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

function drawCircle(x,y,r,color){
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}



function drawText(text,x,y,color){
    ctx.fillStyle=color;
    ctx.font="45px fantasy";
    ctx.fillText(text,x,y);
}

function render(){
    drawRect(0,0,canvas.clientWidth,canvas.clientHeight,"black");

    drawNet();

    drawText(user.score,canvas.width/4,canvas.height/5,"white");
    drawText(com.score,3*canvas.width/4,canvas.height/5,"white");

    drawRect(user.x,user.y,user.width,user.height,"white");
    drawRect(com.x,com.y,com.width,com.height,"white");

    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

canvas.addEventListener('mousemove',movePaddle);

function movePaddle(e){
    let rect = canvas.getBoundingClientRect();
    user.y=e.clientY-rect.top-user.height/2;
}

function collision(b,p){
    b.top=b.y-b.radius;
    b.bottom=b.y+b.radius;
    b.left=b.x-b.radius;
    b.right=b.x+b.radius;

    p.top=p.y;
    p.bottom=p.y+p.height;
    p.left=p.x;
    p.right=p.x+p.width;

    return b.right>p.left && b.bottom>p.top && b.left <p.right && b.top<p.bottom;
}

function resetBall(){
    ball.x=canvas.width/2;
    ball.y=canvas.height/2;

    ball.speed=5;
    ball.velocityX=-ball.velocityX;
}

function update(){
    ball.x += ball.velocityX;
    ball.y +=ball.velocityY;

    let computerLevel=0.01;
    com.y +=(ball.y-(com.y+com.height/2))*computerLevel;

    if(ball.y + ball.radius>canvas.height || ball.y-ball.radius<0){
        ball.velocityY =-ball.velocityY;
    }

    let player=(ball.x<canvas.width/2)?user:com;
    if(collision(ball,player)){
        let collidePoint=ball.y-(player.y+player.height/2);

        collidePoint=collidePoint/(player.height/2);

        let angleRed=collidePoint*Math.PI/4;

        let direction =(ball.x< canvas.width/2)? 1:-1;

        ball.velocityX=direction*ball.speed*Math.cos(angleRed);
        ball.velocityY=ball.speed*Math.sin(angleRed);

        ball.speed +=0.5;
    }

    if(ball.x - ball.radius<0){
        com.score++;
        resetBall();
    }else if(ball.x + ball.radius>canvas.width){
        user.score++;
        resetBall();
    }
}


function game(){
    render();
    update();
}

const framePerSecond=50;
setInterval(game,1000/framePerSecond);
