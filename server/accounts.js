const fs = require('fs');


function accounts(req, res, next)  {
	console.log('accounts');

	const content = 'Some content!'

	fs.writeFile('./data/test.txt', content, err => {
		  if (err) {
				 console.error(err)
	       res.send('Hello accounts world! file write ok')
				    return
			}
		fs.readFile('./data/test.txt', 'utf8' , (err, data) => {
			  if (err) {
					    console.error(err)
					    return
					  }
			  console.log(data)
	    res.send('Hello accounts world! file write ok data='+data)
		})
		  //file written successfully
	})
}
module.exports = accounts;
