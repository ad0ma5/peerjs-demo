const fs = require('fs');

function loadDB(dataPath,dataFolder, res, content){
  var data = "";

	try {
		  data = fs.readFileSync(dataPath, 'utf8')
		  console.log(data)
	} catch (err) {
		  console.error(err)
			res.send('Hello accounts world! file read  not ok')
			return
	}
	 
	return data;
}

function saveDB(dataPath,dataFolder, res, content){
  var data = "";
	
	try {
			data = fs.writeFileSync(dataPath, content)
			//file written successfully
			console.log('Hello accounts world! file write ok', data)
	} catch (err) {
		  console.error(err)
			res.send('Hello accounts world! file write  not ok')
			return
	}
	 
	return data;
}

function checkFolder(dataPath, dataFolder, res){
  var data = true;

	try {
		  if (!fs.existsSync(dataFolder)) {
				 fs.mkdirSync(dataFolder);
			}
	} catch (err) {
		  console.error(err);
	    res.send('Hello accounts world! folder write not ok')
		  return
	}

	return data;
}

function checkFile(dataPath, dataFolder, res){
  var data = true;

	try {
		if(fs.existsSync(dataPath)) {
				console.log("The file exists.");
		} else {
				console.log('The file does not exist.');
			  return false;
		}
	} catch (err) {
		    console.error(err);
	}

	return data;
}

module.exports = { 
	checkFile: checkFile,
  checkFolder: checkFolder,
  saveDB: saveDB,
  loadDB: loadDB
};
