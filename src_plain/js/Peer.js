import Peer from 'peerjs';

//Create a Peer


const peer = new Peer();

const getID = () => { return peer.id };

const connectToID = (another_id) => {
//connect 
	const conn = peer.connect(another_id);
	conn.on('open', () => {
		conn.send('hi!');
	});

//receive
	peer.on('connection', (conn) => {
		conn.on('data', (data) => {
			// Will print 'hi!'
			console.log(data);
		});
		conn.on('open', () => {
			conn.send('hello!');
		});
	});
}

const callToID = (another_id) => {
	//Call

	navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
		const call = peer.call('another-peers-id', stream);
		call.on('stream', (remoteStream) => {
			// Show stream in some <video> element.
		});
	}, (err) => {
		console.error('Failed to get local stream', err);
	});

	//Answer

	peer.on('call', (call) => {
		navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', (remoteStream) => {
				// Show stream in some <video> element.
			});
		}, (err) => {
			console.error('Failed to get local stream', err);
		});
	});
}
export default {
	getID: getID,
	connectToID: connectToID,
	callToID: callToID,
}
