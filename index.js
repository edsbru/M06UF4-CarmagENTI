//Variables que contienen los modulos que realizan esas acciones
let static = require('node-static');
let http = require('http');
let ws = require('ws');

//Instancia de static que accede a la carpeta public
let file = new static.Server('./public');

//Variable que envia los archivos de la carpeta 'public' a la web
//'end' es un evento que espera a que se termine de enviar los datos
let http_server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});

//Instancia el servidor de WS
let ws_server = new ws.WebSocketServer({ server: http_server });

//Escuchamos el puerto de web 8080
http_server.listen(8080);

//Creamos variables para guardar las conexiones que hagan los jugadores
let p1_conn;
let p2_conn;

//Cuando se haga una conexión mandamos 'EVENT Connection' a la conso
ws_server.on('connection', function (conn) {

	console.log('EVENT: Connection');

	//Si no hay nadie conectado como j1
	if(p1_conn == undefined){
		//se le asigna p1_conn
		p1_conn = conn;
		//enviamos que jugador eres
    	p1_conn.send('{"player_num":1}');
    	//Cuando ekl p1 envie datos
		p1_conn.on('message', function(data){
			//si no hay p2, no hace nada
			if (p2_conn == undefined)
	    		return;
			
			//si hay p2 se le envian los datos en String
			p2_conn.send(data.toString());
			console.log(data.toString());
		});
  
	}
	
	//Si no hay nadie conectado como p2
	else if (p2_conn == undefined){
		//se le asigna p2_conn
    	p2_conn = conn;
		//enviamos que jugador eres
		p2_conn.send('{"player_num":2}');
   		//cuando el p2 envie datos
    	p2_conn.on('message', function(data){
		
			//si no hay p1, no hace nada
			if (p1_conn == undefined)
	    		return;
			
			//si hay p1, se le envian datos
			p1_conn.send(data.toString());
    	});
  	}
/*
  conn.on('message', function(data){
    console.log(data.toString());
	});
*/
});
