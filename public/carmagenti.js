let player_num = 0;

const socket = new WebSocket('ws://10.40.1.132:8080');

socket.addEventListener('open', function(event){

});

socket.addEventListener('message', function(event){
  console.log('Server: ', event.data);
  let data = JSON.parse(event.data);

  if(data.player_num != undefined){
   player_num = data.player_num;
   console.log('Jugador num:', player_num);
  }
});

const config = {
 type: Phaser.AUTO,
 width: 800,
 height: 600,
 scene: {
  preload: preload,
  create: create,
  update: update
 }
}

const game = new Phaser.Game(config);

const CAR_SPEED = 2;
const CAR_ROTATION = 2;

let player1_angle = 0; 

let cursors;

let player1;


function preload ()
{
  this.load.image('car1', 'assets/PNG/Cars/car_red_small_1.png');
  this.load.image('car2', 'assets/PNG/Cars/car_blue_small_1.png');
}

function create ()
{
  player1 = this.add.image(400, 300, 'car1');
  player2 = this.add.image(500, 300, 'car2');
  cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
  if (cursors.up.isDown){
   player1.y -= CAR_SPEED*Math.cos(player1_angle*Math.PI/180);
   player1.x += CAR_SPEED*Math.sin(player1_angle*Math.PI/180);
  }

  if (cursors.left.isDown){
   player1_angle -= CAR_ROTATION;
  }

  else if (cursors.right.isDown){
   player1_angle += CAR_ROTATION;
  }

  player1.rotation = player1_angle*Math.PI/180;
  
  var player_data = {
    x: player1.x,
	y: player1.y,
	r: player1.rotation
  };
  
  socket.send(JSON.stringify(player_data));
}
