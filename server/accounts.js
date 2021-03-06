const { checkFile, checkFolder, saveDB, loadDB } = require('./dataHandler.js');

const actions = {
	get: {},
	add: {},
	remove: {},
	login: {}
};


function accounts(req, res, next)  {
	console.log('accounts');
  if(!req.query.action || !actions[req.query.action] ){
	  res.send(JSON.stringify({status:"nok", data:req.query}))
		return
  }
	const action = req.query.action;
	const content = '{"accounts":{}}';
  const dataFolder = './data/';
  const dataPath = dataFolder+'data.json';
	var data = "";
	checkFolder(dataPath, dataFolder, res);
	if(checkFile(dataPath, dataFolder, res)){
	  data = loadDB(dataPath, dataFolder, res, content);
	}
	if(!data) data = content;

  if( action === "get" ){
		if( req.query.email ){
		  var database = JSON.parse(data);
		  const user = database.accounts[req.query.email];
		  
      res.send(JSON.stringify({status: "ok", data: user}));
			return
		}
    res.send(data);
		return
	}
  if( action === "add" ){
		var newAccount = req.query;
		newAccount.id = Date.now();
    delete newAccount.action;
		var database = JSON.parse(data);
		if(!database.accounts) database.accounts = {};
		database.accounts[newAccount.email] = newAccount;
	  saveDB(dataPath, dataFolder, res, JSON.stringify(database));
    res.send(JSON.stringify({status: "ok", data: newAccount}));
		return
	}
  if( action === "remove" && req.query.email ){

		var database = JSON.parse(data);
	  delete database.accounts[req.query.email];
	  saveDB(dataPath, dataFolder, res, JSON.stringify(database));
    res.send(JSON.stringify({status: "ok"}));
		return
	}
	if( action === "login"){
		var database = JSON.parse(data);
		  const user = database.accounts[req.query.email];
    if(user.pass === req.query.pass){
      res.send(JSON.stringify({status: "ok", data: user}));
		  return
		}
	}

	  res.send(JSON.stringify({status:"nok", data:req.query}))
}

module.exports = accounts;
