const { checkFile, checkFolder, saveDB, loadDB } = require('./dataHandler.js');

const actions = {
	get: {},
	add: {},
	remove: {},
};

function sessions(req, res, next)  {
  if(!req.query.action || !actions[req.query.action] ){
	  res.send(JSON.stringify({status:"nok", data:req.query}))
		return
  }
	const action = req.query.action;
	const content = '{"accounts": {}}';
  const dataFolder = './data/';
  const dataPath = dataFolder+'sessions.json';
	var data = "";
	checkFolder(dataPath, dataFolder, res);
	if(checkFile(dataPath, dataFolder, res)){
	  data = loadDB(dataPath, dataFolder, res, content);
	}
	if(!data) data = content;

  if( action === "get" ){
		var database = JSON.parse(data);
		if( req.query.email ){
		  const user = database.accounts[req.query.email];
		  
      res.send(JSON.stringify({status: "ok", data: user}));
			return
		}
    res.send(JSON.stringify({status: "ok", data: database}));
		return
	}

  if( action === "add" && req.query.email ){
		var newSession = req.query;
		newSession.id = Date.now();
    delete newSession.action;
		var database = JSON.parse(data);
		if(!database.accounts) database.accounts = {};
		database.accounts[newSession.email] = newSession;
	  saveDB(dataPath, dataFolder, res, JSON.stringify(database));
    res.send(JSON.stringify({status: "ok", data: newSession}));
		return
	}

  if( action === "remove" && req.query.email ){

		var database = JSON.parse(data);
	  delete database.accounts[req.query.email];
	  saveDB(dataPath, dataFolder, res, JSON.stringify(database));
    res.send(JSON.stringify({status: "ok"}));
		return
	}
	res.send(JSON.stringify({status:"nok", data: req.query}))
}

module.exports = sessions;
