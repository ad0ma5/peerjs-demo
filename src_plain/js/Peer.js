import Peer from 'peerjs';

//Create a Peer


const peer = new Peer();
var conn = null;
var msg = [];

const getID = (receiveMessages, connectionIsUp) => { 
  //receive
	peer.on('connection', (conn_in) => {
		conn = conn_in;
		console.log('incomming connection detected');
		conn.on('data', (data) => {
		  console.log('incomming data detected:', data);
		  msg.push("\n< "+data);
			receiveMessages(data, msg);
			//console.log(data, " from calee ");
		});
		conn.on('open', () => {
		  console.log('incomming open detected');
			conn.send('pong from '+peer.id);
      connectionIsUp();
		});
	});
	return peer.id 

};

	  //Peer.connectToID(another, receiveMessages, connectionIsUp);
const connectToID = (another_id, receiveMessages) => {
  //connect 
	conn = peer.connect(another_id);
	conn.on('open', () => {
		console.log('outgoing open detected sending ping');
		conn.send('ping from '+peer.id+' to '+another_id);
	});
	conn.on('data', function(data) {
    console.log('Received', data);
		  msg.push("\n< "+data);
			receiveMessages(data, msg);
  });

}

const sendMessage = (msg_) => {
  if (conn && conn.open) {
		console.log('outgoing msg detected', msg_ );
    conn.send(msg_);
		  msg.push("\n> "+msg_);
  }
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
	sendMessage: sendMessage,
	callToID: callToID,
}
