
const https = require('https')

const httpGet = ( setResponse, query, path) => {

	const options = {
		hostname: 'b5277.k.dedikuoti.lt',
			port: 9000,
			path: '/'+path+'?action='+query,
			method: 'GET'
	}

	const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode} ${options.path}`)

		  let rawData = [];

		  res.on('data', (chunk) => {
			   rawData.push( chunk );
	    });

		  res.on('end', () => {
				try {
					//console.log('trying to end data transfer');
					const data = Buffer.concat(rawData).toString();

					const parsedData = JSON.parse(data);
					setResponse(parsedData);
				} catch (e) {
					console.error("error in httpGet ", e);
				}
			});
	})

	req.on('error', error => {
			console.error(error)
	});

	req.end();

};

export default httpGet;
