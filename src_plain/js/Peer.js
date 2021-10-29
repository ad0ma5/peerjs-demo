import Peer from 'peerjs';

//Create a Peer


var peer = null;
var conn = null;
var call = null;
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
				setExternal(conn.peer); 
				connectionIsUp(); 

				receiveMessages("connection open to "+conn.peer);
			  console.log('incomming connectionaopen  detected',conn);
			});
			conn.on('data', (data) => {
				receiveMessages(data);
			  console.log('incomming DATA', data);
			});
	    conn.on('close', connectionClosed);
		});
		
		//Answer call
		peer.on('call', (call_in) => {
			console.log('incomming call detected',call_in);
			call = call_in;
			call.answer(localStream); // Answer the call with an A/V stream.
			call.on('stream', (remoteStream) => {
				// Show stream in some <video> element.
				console.log('incomming call stream detected');
				setRemoteStream(remoteStream);
				setCallSet(true);
			});
			call.on('close', () => {
				console.log('incomming call stream CLOSE detected');
				setRemoteStream(false);
				setCallSet(false);
			});
		});
		console.log("gotId", peer.id);
		set_id(peer.id);

	},500);//end timeout
	//return peer.id 

};

	  //Peer.connectToID(another, receiveMessages, connectionIsUp);
const connectToID = (another_id, receiveMessages, connectionIsUp, connectionClosed) => {
	const options = { label: "Private chat" };
  //connect 
	conn = peer.connect(another_id, options);
	console.log('peer connect',conn, peer, another_id);
	conn.on('open', connectionIsUp);
	conn.on('data', receiveMessages);
	conn.on('close', connectionClosed);

	console.log('peer connect DONE',conn, peer, another_id);
}
 const closeChat = (setChatSet) => {
	 console.log('close connection',conn,peer);
	 if(conn)
     conn.close();
   setChatSet(false);
 }

const sendMessage = (msg_) => {
  if (conn && conn.open) {
		console.log('outgoing msg detected', msg_ );
    conn.send(msg_);
  }
}

const callToID = (another_id, setRemoteStream, localStream, callIsUp ) => {
	//Call

	console.log("callToID", another_id);
	call = peer.call(another_id, localStream);
		callIsUp();
	//*
	setTimeout(()=>{
		
		if(!call) return;

		console.log('donothing');
		call.on('stream', (remoteStream) => {
			// Show stream in some <video> element.
			console.log('outgoing call incomming stream detected');
			setRemoteStream(remoteStream);
		});
		call.on('close', () => {
			console.log('outgoing call incomming Close of stream detected');
			setRemoteStream(false);
			setCallSet(false);
		});
	},500);
  //*/

}

const closeCall = (setCallSet) => {
  call.close();
	setCallSet(false);
};

const disconnect = () => {
  peer.disconnect();


}


export default {
	getID: getID,
	connectToID: connectToID,
	sendMessage: sendMessage,
	callToID: callToID,
	disconnect: disconnect,
  closeChat: closeChat,
  closeCall: closeCall
}
