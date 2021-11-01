const { ExpressPeerServer } = require('peer');
const fs = require('fs');

const express = require('express');
const http = require('https');
const accounts = require('./server/accounts.js');
const sessions = require('./server/sessions.js');

var sslOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const app = express();
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'https://b5277.k.dedikuoti.lt:1234');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	next();
});
const server = http.createServer(sslOptions, app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
	  ssl: {
			    key: fs.readFileSync('./key.pem'),
			    cert: fs.readFileSync('./cert.pem')
			  },
  //path: '/'
});
peerServer.on('connection', (client) => { 
    console.log('connected client', client.id);
	 return client;
});
app.use('/peerjs', peerServer);
app.get('/', (req, res, next) => res.send('Hello world!'));
app.use(express.static('./dist'))
app.use('/peerjs/accounts', accounts);
app.use('/peerjs/sessions', sessions);
const port = 9000;
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
// ========

