//CARMAGENTI.JS

//#TODO
//Que es / hace function(event)?
//Que es / hace socket?
//Que es / hace data?

//Empezamos siendo jug 0, esto está arriba para que lo vea todo el script
let player_num = 0;

//Declaramos las variables de los jugadores.
let player1;
let player2;

//#TODO Creamos una variable donde guardar la ip del servidor o del socket...?
const socket = new WebSocket('ws://10.40.1.132:8080');

//#TODO Abrimos un listener que espera a...X y hace function(event)?
socket.addEventListener('open', function(event){

});

//#TODO Mandamos un mensaje diciendo "Server", por que?
socket.addEventListener('message', function(event){
	console.log('Server: ', event.data);

	//#TODO Hacemos una variable data que parsea...que?
	let data = JSON.parse(event.data);

	//#TODO Si data.player_num ¿no es undefined?
	if(data.player_num != undefined){
  		//#TODO Guardamos en una variable "data.player_num"?
		player_num = data.player_num;
		console.log('Jugador num:', player_num);
	}

	//#TODO Si >data< NO es undefined
	else if (data.x != undefined){
	
	//Si el valor de player_num es 2
	if(player_num == 2){
		//ponemos los datos del coche p1 en la variable "player1"
		player1.x = data.x;
		player1.y = data.y;
		player1.rotation = data.r;
		}
	}
});

//Cosas de phaser
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

//Variables con Velocidad y velocidad de rotación de los coches
const CAR_SPEED = 2;
const CAR_ROTATION = 2;

//Var que guarda el angulo del coche
let player1_angle = 0; 

//#TODO Variable que...?
let cursors;

function preload ()
{
	//cargamos las imágenes de los coches
	this.load.image('car1', 'assets/PNG/Cars/car_red_small_1.png');
	this.load.image('car2', 'assets/PNG/Cars/car_blue_small_1.png');
}

function create ()
{
	//#TODO CREAMOS/INSTANCIAMOS los coches y ¿cursors...?
	player1 = this.add.image(400, 300, 'car1');
	player2 = this.add.image(500, 300, 'car2');
	cursors = this.input.keyboard.createCursorKeys();
}

function update ()
{
	//Si el player_num es 0
	if (player_num == 0){
		//#TODO ¿No pasa nada...?
		return;
	}

	//Si player_num es 1
	if (player_num == 1){

	//Si la "flecha arriba" se pulsa, haz mates
	if (cursors.up.isDown){
		player1.y -= CAR_SPEED*Math.cos(player1_angle*Math.PI/180);
		player1.x += CAR_SPEED*Math.sin(player1_angle*Math.PI/180);
	}
  
	//Si la "flecha izquierda" se pulsa haz mates y gira el coche
	if (cursors.left.isDown){
		player1_angle -= CAR_ROTATION;
  	}

	//Si la "flecha derecha" se pulsa haz mates para girar el coche
	else if (cursors.right.isDown){
		player1_angle += CAR_ROTATION;
	}
  
	//#TODO ¿Angle y rotation son diferentes?
	player1.rotation = player1_angle*Math.PI/180;
  
	//Hacemos una variable que guarda las coordenadas del jugador1
	var player_data = {
		x: player1.x,
		y: player1.y,
		r: player1.rotation
	};

	//Mandamos por el socket los datos del jugador1 en STRING
	socket.send(JSON.stringify(player_data));
	}
}
