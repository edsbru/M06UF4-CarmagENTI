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
let playerWin;

//TODO "shootAngle" guarda el angulo del coche cuando se dispara la bala
let shoot = false;
let player1_shootAngle;
let player2_shootAngle;
const BULLET_SPEED = 2;

// Creamos una variable donde guardar la ip del servidor al que vamos a hacer conexión
const socket = new WebSocket('ws://192.168.1.58:8080');

//Abrimos un listener que espera a que se abra la conexión con un cliente y mete los datos en function(event)
//socket.addEventListener('open', function(event){	
//});

//RECIBIMOS DATA
//Mandamos un mensaje diciendo "Server", para comprobar que nos llegan datos
socket.addEventListener('message', function(event){
	console.log('Server: ', event.data);
	
	if(event.data === "Player 1 Wins"){
		console.log("HA GANADO EL JUGADOR 1");
		winner.text = "Ha ganado el jugador 1";	
	}

	else if(event.data === "Player 2 Wins"){
		console.log("HA GANADO EL JUGADOR 2");
		winner.text = "Ha ganado el jugador 2";
	}

	else{

		//Hacemos una variable data que parsea a JavaScript el texto recibido por 'message'
		let data = JSON.parse(event.data);

		//Si data.player_num tiene valor (diferente de undefined) significa que nos envia nuestro numero de jugador.
		if(data.player_num != undefined){
  			//Guardamos el numero del jugador que viene de los datos que hemos recibido
			player_num = data.player_num;
			console.log('Jugador num:', player_num);
		}

		// Si recibimos coordenadas
		else if (data.x != undefined){
			//Si el valor de player_num es 1 (somos el jugador 1)
			if(player_num == 1){
				//recibimos los datos del coche del p2 en  "player2"
				player2.x = data.x;
				player2.y = data.y;
				player2.rotation = data.r;
			}

			//Si el valor de player_num es 2 (somos el jugador 2)
			if(player_num == 2){
				//recibimos los datos del coche del  p1 en  "player1"
				player1.x = data.x;
				player1.y = data.y;
				player1.rotation = data.r;
			}

			if(player_num > 2 && data.p == 1){
				player1.x = data.x;
				player1.y = data.y;
				player1.rotation =  data.r;
			}
			
			if(player_num > 2 && data.p == 2){
				player2.x = data.x;
				player2.y = data.y;
				player2.rotation =  data.r;
			}

		}
	
		// Si recibimos coordenadas de bala
		if(data.bx != undefined){
			//Si el valor de player_num es 1 (somos el jugador 1)
			if(player_num == 1){

				//Si la pos de la bala del player2 es diferente a la pos que recibimos del server, la bala esta en movimiento
				if(bullet2.x != data.bx){
					bullet2.setVisible(true);
				}

				bullet2.x = data.bx;
				bullet2.y = data.by;
			}

			//Si el valor de player_num es 2 (somos el jugador 2)
			if(player_num == 2){

				if(bullet1.x != data.bx){
					bullet1.setVisible(true);
				}

				bullet1.x = data.bx;
				bullet1.y = data.by;
			}

			if(player_num > 2 && data.bp == 1){
				if(bullet1.x != data.bx){
					bullet1.setVisible(true);
				}
				bullet1.x = data.bx;
				bullet1.y = data.by;
			}
			
			if(player_num > 2 && data.bp == 2){
				if(bullet2.x != data.bx){
					bullet2.setVisible(true);
				}
				bullet2.x = data.bx;
				bullet2.y = data.by;
			}
		}

	}

});


//Cosas de phaser
//Configuración de Phaser
const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			debug: true
		}
	},
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
let player2_angle = 0;

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
	winner = this.add.text(250, 250, " ", {fontSize: '30px',  color: '#F01B19'});
	player1 = this.physics.add.sprite(400, 300, 'car1');
	player2 = this.physics.add.sprite(500, 300, 'car2');
	bullet1 = this.physics.add.sprite(-100, -100, 'bullet1');
	bullet2 = this.physics.add.sprite(-100, -150, 'bullet2');
	cursors = this.input.keyboard.createCursorKeys();
	spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

	bullet1.setVisible(false);
	bullet2.setVisible(false);

	//Se produce colisión 
	this.physics.add.collider(player1, bullet2, function (player1, bullet2){
		//player1.x = 0;
		//player1.y = 0;
		//player 2 gana	
		socket.send("Player 2 Wins");	
		
	});

	this.physics.add.collider(player2, bullet1, function (player2, bullet1){ 
		//player2.x = 0;
		//player2.y = 0;
		//player 1 gana
		socket.send("Player 1 Wins");	
		
	});

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

		//TODO
		if(shoot == true){
			//console.log(bullet1.x);
			bullet1.y -= BULLET_SPEED*Math.cos(player1_shootAngle*Math.PI/180);
			bullet1.x += BULLET_SPEED*Math.sin(player1_shootAngle*Math.PI/180);
		}

		spacebar.on('down', (key, event) => {

			if(shoot == false){
				shoot = true;
				player1_shootAngle = player1_angle;
				bullet1.setVisible(true);
				bullet1.x = player1.x;
				bullet1.y = player1.y;
			}

		});
  
		//rotation es la acción de girar y angle son los grados.
		player1.rotation = player1_angle*Math.PI/180;

		//Hacemos una variable que guarda las coordenadas del jugador1
		let player1_data = {
			x: player1.x,
			y: player1.y,
			r: player1.rotation,
			p: 1
		};

		let bullet1_data = {
			bx: bullet1.x,
			by: bullet1.y,
			bp: 1
		};
		//ENVIAMOS DATA
		//Mandamos por el socket los datos del jugador1 en STRING
		socket.send(JSON.stringify(player1_data));
		socket.send(JSON.stringify(bullet1_data));

	}

	//Si player_num es 2
	if (player_num == 2){

		//Si la "flecha arriba" se pulsa, haz mates
		if (cursors.up.isDown){
			player2.y -= CAR_SPEED*Math.cos(player2_angle*Math.PI/180);
			player2.x += CAR_SPEED*Math.sin(player2_angle*Math.PI/180);
		}
  
		//Si la "flecha izquierda" se pulsa haz mates y gira el coche
		if (cursors.left.isDown){
			player2_angle -= CAR_ROTATION;
  		}

		//Si la "flecha derecha" se pulsa haz mates para girar el coche
		else if (cursors.right.isDown){
			player2_angle += CAR_ROTATION;
		}

		//Disparo
		if(shoot == true){
			//console.log(bullet2.x);
			bullet2.y -= BULLET_SPEED*Math.cos(player2_shootAngle*Math.PI/180);
			bullet2.x += BULLET_SPEED*Math.sin(player2_shootAngle*Math.PI/180);
		}

		spacebar.on('down', (key, event) => {

			if(shoot == false){
				shoot = true;
				player2_shootAngle = player2_angle;
				bullet2.setVisible(true);
				bullet2.x = player2.x;
				bullet2.y = player2.y;
			}

		});
  
		//rotation es la acción de girar y angle son los grados.
		player2.rotation = player2_angle*Math.PI/180;

		//Hacemos una variable que guarda las coordenadas del jugador1
		let player2_data = {
			x: player2.x,
			y: player2.y,
			r: player2.rotation,
			p: 2
		};

		let bullet2_data = {
			bx: bullet2.x,
			by: bullet2.y,
			bp: 2
		};

		//Mandamos por el socket los datos del jugador1 en STRING
		socket.send(JSON.stringify(player2_data));
		socket.send(JSON.stringify(bullet2_data));
		//socket.send("hola");
	}
}
