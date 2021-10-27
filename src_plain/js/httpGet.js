
const https = require('https')

const httpGet = ( setResponse, query, path) => {

	const options = {
		hostname: 'b5277.k.dedikuoti.lt',
			port: 9000,
			path: '/'+path+'?action='+query,
			method: 'GET'
	}

	const req = https.request(options, res => {
			console.log(`statusCode: ${res.statusCode}`)

		  let rawData = [];

		  res.on('data', (chunk) => {
			   rawData.push( chunk );
	    });

				//process.stdout.write(d)
		  res.on('end', () => {
				try {
					const data = Buffer.concat(rawData).toString();

					const parsedData = JSON.parse(data);
					setResponse(parsedData);
				} catch (e) {
					console.error(e);
				}
			});
	})

	req.on('error', error => {
			console.error(error)
	})

	req.end()

}

export default httpGet;
