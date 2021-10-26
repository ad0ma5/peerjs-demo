const { PeerServer } = require('peer');
const fs = require('fs');

console.log("Loading server...");

const peerServer = PeerServer({
	  port: 9000,
	  path: '/myapp',
	  debug: true,
	  ssl: {
			    key: fs.readFileSync('./key.pem'),
			    cert: fs.readFileSync('./cert.pem')
			  }
	  //proxied: true
});

peerServer.on('connection', (client) => { 
    console.log('connected client', client.id);
	 return client;
});

console.log("Loaded server... ");
