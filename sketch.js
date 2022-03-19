const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var board1, board2;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);

  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();

      //with distance formula
      d1 = dist(playerArrows[i].body.position.x,playerArrows[i].body.position.y, board1.body.position.x,board1.body.position.y)
      if(d1<=100)
      {
        console.log("collision");
      }

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided) {
        console.log("yes");
      }
      if (numberOfArrows == 0){
        gameover();
      }
      //[optional code to add trajectory of arrow]
      
      // var posX = playerArrows[i].body.position.x;
      // var posY = playerArrows[i].body.position.y;

      // if (posX > width || posY > height) {
      //   if (!playerArrows[i].isRemoved) {
      //     playerArrows[i].remove(i);
      //   } else {
      //     playerArrows[i].trajectory = [];
      //   }
      // }
    }
  }

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);
 
  if (board1Collision.collided || board2Collision){
    score += 5;
  }

  if (numberOfArrows == 0) {
    console.log("arrow bucket is empty")
  }
}


function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameover(){
  swal({
    title: 'Game Over Loser!!!',
    test: "Don't Play This Game Again Noob!!",
    imageUrl:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.facebook.com%2Fjustfootball2018%2Fphotos%2Fa.1937782903189443%2F2553823704918690%2F%3Ftype%3D3&psig=AOvVaw2KQ5Ik8gqTSPcb3nRuPj96&ust=1647763495060000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCID5p8Tb0fYCFQAAAAAdAAAAABAP',
    imageSize: '150*150',
    confirmButtonText: "Don't Dare Play Again"
  },
  function(isConfirm){
   if (isConfirm){
    location.reloaded();
     }
    }
  );
}
