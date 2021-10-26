const { ExpressPeerServer } = require('peer');
const fs = require('fs');

const express = require('express');
const http = require('https');
const accounts = require('./server/accounts.js');

var sslOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const app = express();
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
app.use('/accounts', accounts);
const port = 9000;
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
// ========

