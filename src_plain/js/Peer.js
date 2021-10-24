import Peer from 'peerjs';

//Create a Peer


const peer = new Peer(null, {
                        debug: 2
                    });
var conn = null;


const getID = (setExternal, receiveMessages, connectionIsUp, setRemoteStream, setLocalStream, setCallSet) => { 
  //receive
	peer.on('connection', (conn_in) => {
		conn = conn_in;
		console.log('incomming connection detected',conn);
		conn.on('data', receiveMessages);
		conn.on('open', () => { connectionIsUp(); setExternal(conn.peer); });
	});
	
	//Answer call
	peer.on('call', (call) => {
		console.log('incomming call detected',call);
		navigator.mediaDevices.getUserMedia({video: true, audio: true}, (stream) => {
      setLocalStream(stream);
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', (remoteStream) => {
				// Show stream in some <video> element.
		    console.log('incomming call stream detected',stream);
				setRemoteStream(stream);
        setCallSet(true);
			});
		}, (err) => {
			console.error('Failed to get local stream', err);
		});
	});
	return peer.id 

};

	  //Peer.connectToID(another, receiveMessages, connectionIsUp);
const connectToID = (another_id, receiveMessages, connectionIsUp) => {
	const options = { label: "Private chat" };
  //connect 
	conn = peer.connect(another_id, options);
	console.log('peer connect',conn, peer);
	conn.on('open', connectionIsUp);
	conn.on('data', receiveMessages);
}

const sendMessage = (msg_) => {
  if (conn && conn.open) {
		console.log('outgoing msg detected', msg_ );
    conn.send(msg_);
		  //msg.push("\n> "+msg_);
  }
}

const callToID = (another_id, setRemoteStream, setLocalStream, setCallSet) => {
	//Call

	console.log("callToID");
	navigator.mediaDevices.getUserMedia({video: {}, audio: true}, (stream) => {
		console.log('outgoing call stream detected',stream);
    setLocalStream(stream);
      setCallSet(true);
		const call = peer.call(another_id, stream);
		call.on('stream', (remoteStream) => {

		  console.log('outgoing call incomming stream detected',stream);
			setRemoteStream(stream);
      setCallSet(true);
			// Show stream in some <video> element.
		});
	}, (err) => {
		console.error('Failed to get local stream', err);
	});

}
export default {
	getID: getID,
	connectToID: connectToID,
	sendMessage: sendMessage,
	callToID: callToID,
}
