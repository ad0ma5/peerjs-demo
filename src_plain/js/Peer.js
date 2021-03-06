import Peer from 'peerjs';

//Create a Peer


window.peer = null;
window.conn = null;
window.call = null;
window.functionsP = {};
/*
*/

const getID = (set_id, setExternal_id, receiveMessages, connectionIsUp, setRemoteStream, getLocalStream, setCallSet, connectionClosed, onCall) => { 
  functionsP.getLocalStream = getLocalStream;
  functionsP.setRemoteStream = setRemoteStream;
  //receive
console.log("Peer.getID" );
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
			  console.log('incomming connection open  detected :',conn);
				console.log("setting setExternal_id to ", conn.peer);
				setExternal_id(conn.peer); 
				connectionIsUp(); 

				receiveMessages(JSON.stringify({type: "message", content: "connection open to "+conn.peer}));
			});
			conn.on('data', (data) => {
				receiveMessages(data);
			  console.log('incomming DATA', data);
			});
	    conn.on('close', connectionClosed);
		});
		
		//Answer call
		//peer.on('call', onCall);
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
const connectToID = (another_id, receiveMessages, connectionIsUp, connectionClosed, user) => {
	const options = { 
		label: "Private chat",
		metadata: { userFrom: user.username, emailFrom: user.email},
		serialization: "json"
	};
  //connect 
	conn = peer.connect(another_id, options);
	console.log('peer connect',conn, peer, another_id, options);
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
	var c = peer.call(another_id, localStream);
	setCallSet(true);
	c.on('stream', (stream) =>{ setRemoteStream(stream)});
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
		call = c;
//		setRemoteStream(call.remoteStream);

		//return;
	}
//*
	
}

const closeCall = (setCallSet) => {
	console.log("close local call",call);
  if(call){
		call.close();
		call = null;
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
