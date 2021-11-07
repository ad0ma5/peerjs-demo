import Peer from 'peerjs';

//Create a Peer


window.peer = null;
window.conn = null;
window.call = null;
/*
*/
const getID = (set_id, setExternal, receiveMessages, connectionIsUp, setRemoteStream, localStream, setCallSet, connectionClosed) => { 
  //receive
console.log("Peer.getID");
  peer = new Peer(null, {
      	host: 'b5277.k.dedikuoti.lt',
	      port: 9000,
	      path: '/peerjs',
        debug: 2
                    });
	peer.on("open", function(id) {
		    console.log("peer.on(\"open\")My peer ID is: " + id);
		//Answer data connection
		peer.on('connection', (conn_in) => {
			conn = conn_in;
			console.log('incomming connection detected',conn);
			conn.on('open', () => { 
				setExternal(conn.peer); 
				connectionIsUp(); 

				receiveMessages(JSON.stringify({type: "message", content: "connection open to "+conn.peer}));
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
			console.log('AAAAAA incomming call detected and passing local stream (Answer)',call_in);
			call = call_in;
			call.answer(localStream); // Answer the call with an A/V stream.
			call.on('stream', setRemoteStream);
			//BUG IN PEERJS close on call never fire
			/*
			call.on('close', () => {
				console.log('incomming call stream CLOSE detected');
				setRemoteStream(false);
				setCallSet(false);
			});
			*/
		});

		set_id(peer.id);
	});//end peer.on("open")
/*
	setTimeout(()=>{
		console.log('donothing inside timeout after connecting');
	
		console.log("getId",peer);
		console.log("gotId", peer.id);

	},500);//end timeout
	//return peer.id 
*/
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

const callToID = (another_id, setRemoteStream, localStream, callIsUp, setCallSet ) => {
	//Call

	console.log("callToID", another_id, peer);
	if(localStream === null){
		console.log("NO LOCAL STREAM, ENABLE VIDEO?");
		alert("no local");
		return;
	}
	const c = peer.call(another_id, localStream);
	c.on('stream', setRemoteStream);
	console.log("callToID adding stream and close hooks", another_id);
	
	/*
	call.on('close', () => {
		console.log('outgoing call incomming Close of stream detected');
		setRemoteStream(false);
		setCallSet(false);
	});
  //*/

	if(!call){
		console.log("NO call OBJECT! refresh?", c);
	//	call = c;
//		setRemoteStream(call.remoteStream);

		//return;
	}
//*
	
}

const closeCall = (setCallSet) => {
	console.log("close local call",call);
  if(call){
		call.close();
	}else{
		console.log("no call to close found? ");
	}
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
