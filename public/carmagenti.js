//CARMAGENTI.JS

//#TODO
//Que es / hace function(event)?
//Función anónima, se usa para pasar funciones como parámetros
//Que es / hace socket?
//Es lo que conecta el cliente con el servidor, es el "tubo"
//Que es / hace data?
//Es una prpiedad de event, cuya información nos ha llegado a través de los eventos 'open' o 'message'

//Empezamos siendo jug 0, esto está arriba para que lo vea todo el script
let player_num = 0;

//Declaramos las variables de los jugadores.
let player1;
let player2;

// Creamos una variable donde guardar la ip del servidor al que vamos a hacer conexión
const socket = new WebSocket('ws://10.40.1.132:8080');

//Abrimos un listener que espera a que se abra la conexión con un cliente y mete los datos en function(event)
socket.addEventListener('open', function(event){

});

//Mandamos un mensaje diciendo "Server", para comprobar que nos llegan datos
socket.addEventListener('message', function(event){
	console.log('Server: ', event.data);

	//Hacemos una variable data que parsea a JavaScript el texto recivido por 'message'
	let data = JSON.parse(event.data);

	//Si data.player_num tiene valor (diferente de undefined) significa que nos envia nuestro numero de jugador.
	if(data.player_num != undefined){
  		//Guardamos el numero del jugador que viene de los datos que hemos recibido
		player_num = data.player_num;
		console.log('Jugador num:', player_num);
	}

	// Si recibimos coordenadas
	else if (data.x != undefined){
	
	//Si el valor de player_num es 2 (somos el jugador 2)
		if(player_num == 2){
			//recibimos los datos del coche del  p1 en  "player1"
			player1.x = data.x;
			player1.y = data.y;
			player1.rotation = data.r;
		}
	}
});

//Cosas de phaser
//Configuración de Phaser
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
//Inicialización de Phaser
const game = new Phaser.Game(config);

//Variables con Velocidad y velocidad de rotación de los coches
const CAR_SPEED = 2;
const CAR_ROTATION = 2;

//Var que guarda el angulo del coche
let player1_angle = 0; 

//Variable que guarda el control por flechas(que se llaman cursores)
let cursors;

//#TODO Var que guarda el control de la spacebar
let spacebar;

function preload ()
{
	//cargamos las imágenes
	this.load.image('background', 'assets/racetrack.jpg');
	this.load.image('car1', 'assets/PNG/Cars/car_red_small_1.png');
	this.load.image('car2', 'assets/PNG/Cars/car_blue_small_1.png');
	this.load.image('bullet1', 'assets/PNG/Objects/barrel_red.png');
	this.load.image('bullet2', 'assets/PNG/Objects/barrel_blue.png');
}

function create ()
{
	//CREAMOS/INICIALIZAMOS los coches y el objeto que registra los inputs.
	background = this.add.image(400, 300, 'background');
	player1 = this.add.image(400, 300, 'car1');
	player2 = this.add.image(500, 300, 'car2');
	bullet1 = this.add.image(300, 300, 'bullet1');
	bullet2 = this.add.image(300, 350, 'bullet2');
	cursors = this.input.keyboard.createCursorKeys();
	spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	bullet1.setVisible(false);
	bullet2.setVisible(false);
}

function update ()
{
	//Si el player_num es 0 (No nos hemos conectado)
	if (player_num == 0){
		//No pasa nada
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

	spacebar.on('down', (key, event) => {
		bullet1.x = player1.x;
		bullet1.y = player1.y - 60;
		bullet1.setVisible(true);
	});
  
	//rotation es la acción de girar y angle son los grados.
	player1.rotation = player1_angle*Math.PI/180;

	//Hacemos una variable que guarda las coordenadas del jugador1
	let player_data = {
		x: player1.x,
		y: player1.y,
		r: player1.rotation
	};

	let bullet1_data = {
		bx: bullet1.x,
		by: bullet1.y
	};

	//Mandamos por el socket los datos del jugador1 en STRING
	socket.send(JSON.stringify(player_data));
	}
}
