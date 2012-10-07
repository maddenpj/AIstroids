var express = require('express'); 
var http = require('http');
var app = express(); 
var server = http.createServer(app);
var io  = require('socket.io').listen(server); 

var blob = JSON.parse(require('fs').readFileSync(process.argv[2]));

server.listen(8080); // start listening on 8080
app.configure(function () {
	app.use(express.static(__dirname+'/public')); // I will statically server all files in public 
});
app.get('/', function (request, response) { // Route / -> index.html 
	response.sendfile(__dirname+'/index.html'); 
});


function Client(socket)
{
	this.username = ''; // Unused 
	this.socket = socket;
}

clients = [];
posts = []; 

// socket.io 
io.sockets.on('connection', function (socket) {
	clients.push(new Client(socket));



	socket.emit('data', blob);

	// Remove client from Clients
	socket.on('disconnect', function () { 
		for( var i = 0; i < clients.length; i++)
		{
			if(socket == clients[i].socket)
			{
				console.log('Disconnecting: ' + clients.username);
				clients.splice(i,1);
				break;
			}
		}
	});
});
