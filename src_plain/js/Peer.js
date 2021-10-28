import Peer from 'peerjs';

//Create a Peer


var peer = null;
var conn = null;
/*
*/
const getID = (set_id, setExternal, receiveMessages, connectionIsUp, setRemoteStream, localStream, setCallSet, connectionClosed) => { 
  //receive

  peer = new Peer(null, {
      	host: 'b5277.k.dedikuoti.lt',
	      port: 9000,
	      path: '/peerjs',
        debug: 2
                    });
	setTimeout(()=>{
		console.log('donothing');
	
		console.log("getId",peer);
		peer.on('connection', (conn_in) => {
			conn = conn_in;
			console.log('incomming connection detected',conn);
			conn.on('open', () => { 
			  console.log('incomming connectionaopen  detected',conn);
				connectionIsUp(); 
				setExternal(conn.peer); 
			});
			conn.on('data', receiveMessages);
	    conn.on('close', connectionClosed);
		});
		
		//Answer call
		peer.on('call', (call) => {
			console.log('incomming call detected',call);
			call.answer(localStream); // Answer the call with an A/V stream.
			call.on('stream', (remoteStream) => {
				// Show stream in some <video> element.
				console.log('incomming call stream detected');
				setRemoteStream(remoteStream);
				setCallSet(true);
			});
		});
		console.log("gotId", peer.id);
		set_id(peer.id);
	},500);
	//return peer.id 

};

	  //Peer.connectToID(another, receiveMessages, connectionIsUp);
const connectToID = (another_id, receiveMessages, connectionIsUp, connectionClosed) => {
	const options = { label: "Private chat" };
  //connect 
	conn = peer.connect(another_id, options);
	console.log('peer connect',conn, peer);
	conn.on('open', connectionIsUp);
	conn.on('data', receiveMessages);
	conn.on('close', connectionClosed);
}
 const closeChat = () => {
	 console.log('close connection',conn,peer);
	 if(conn)
     conn.close();
 }

const sendMessage = (msg_) => {
  if (conn && conn.open) {
		console.log('outgoing msg detected', msg_ );
    conn.send(msg_);
  }
}

const callToID = (another_id, setRemoteStream, localStream, setCallSet) => {
	//Call

	console.log("callToID", another_id);
	const call = peer.call(another_id, localStream);
	setTimeout(()=>{
		console.log('donothing');
	
	},500);

	call.on('stream', (remoteStream) => {
		// Show stream in some <video> element.
		console.log('outgoing call incomming stream detected');
		setRemoteStream(remoteStream);
		setCallSet(true);
	});

}

const disconnect = () => {
  peer.disconnect();


}


export default {
	getID: getID,
	connectToID: connectToID,
	sendMessage: sendMessage,
	callToID: callToID,
	disconnect: disconnect,
  closeChat: closeChat
}
