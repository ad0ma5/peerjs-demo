
import React, { useRef, useEffect, useState } from 'react';
import Peer from './Peer.js';

import User from './components/User.js';
import PeerID from './components/PeerID.js';
import ExternalID from './components/ExternalID.js';
import MsgList from './components/MsgList.js';
import VideoCall from './components/VideoCall.js';
import Login from './components/Login.js';
import Channel from './components/Channel.js';

import httpGet from "./httpGet.js";

const  App = () => {

  // Declare a new state variable, which we'll call "count"
  const [user, setUser] = useState({});
  const [userSet, setUserSet] = useState(false);
  const [external_id, setExternal_id] = useState("");
  const [id, set_id] = useState("");
  const [idSet, set_idSet] = useState(false);
  const [hide, setHide] = useState(false);
  const [msg, setMsg] = useState([]);
  const [start, setStart] = useState(false);
  const [chatSet, setChatSet] = useState(false);
  const [tmpMsg, setTmpMsg] = useState("");
	const [newMsg, setNewMsg] = useState(0);
	const [inNewMsg, setInNewMsg] = useState("");
  const [remoteStream, setRemoteStream] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [callSet, setCallSet] = useState(false);
  const [session, setSession] = useState({});

	const setResponse = ( response ) => {
    console.log("response from httpGet", response);
		if(response.status === "ok"){
      setSession({});
		}
	}

	const startSession = () => {
		const query = "add&&email="+user.email+"&peer_id="+id+"&online=true";
	  httpGet(setResponse, query, "sessions");
	};

	const endSession = () => {
		const query = "remove&&email="+user.email+"&peer_id="+id+"&online=true";
	  httpGet(setResponse, query, "sessions");
	};

	useEffect(() => {
		console.log('session changed');
	}, [session] );

	useEffect(() => {
		if(id){
			set_idSet(true);
		  //start session
      startSession();
		}
	}, [id] );

	useEffect(() => {
    var loadID = "";
	  var url = window.location.href;       
		var urlSplit = url.split( "?" );       
		if(urlSplit[1]) { 
			loadID = urlSplit[1].replace( "id=", "" );
			if(loadID) setExternal_id(loadID);
		}
	}, [external_id] );
	

	useEffect(() => {
		if(true || newMsg > 0){
			//console.log("use effect msg" , msg, inNewMsg); // this prints the updated value
			const m = msg.slice(); //[...msg];
			m.push("\n< "+inNewMsg);
			console.log("RECEIVE effect",m,  msg );
			setMsg(m);	
			const nm = newMsg+1;
			setNewMsg(nm);
		}
	}, [ inNewMsg  ]); // this will be triggered only when state value is different

	useEffect(() => {
    if(callSet){
		  console.log('effect incomming open detected ',id);
		  if(id && id != "")
		    sendMessages('open '+id);
		}
	}, [ chatSet ]); // this will be triggered only when state value is different

	useEffect(() => {
    if(callSet){
		  console.log('effect incomming call  detected ',id);
		  if(id && id != "")
		    sendMessages('open call '+id);
		}
	}, [  callSet ]); // this will be triggered only when state value is different

	const updateQS = (val) => {
	  var url = window.location.href;       
		var urlSplit = url.split( "?" );       
		var stateObj = { Title : "New title", Url: urlSplit[0] + "?id="+val };       
		history.pushState(stateObj, stateObj.Title, stateObj.Url);
	};
  
	const updateE_id = (val) => {
    setExternal_id(val);
    updateQS(val);
	};

	const receiveMessages = (msg_in) => {
		console.log("RECEIVE",msg_in, msg);
    setInNewMsg(msg_in);
	};

	const sendMessages = (msg_in) => {
		console.log("SEND",msg_in, msg);
	  Peer.sendMessage(msg_in);
	  const m = msg.slice(); // [...msg];
		m.push("\n> "+msg_in);
		setMsg(m);
    setTmpMsg("");
		const nm = newMsg+1;
    setNewMsg(nm);
	};

  const connectionIsUp = () => {
    receiveMessages("connection is open");
    setChatSet(true);
	}

	const callIsUp = () => {
    receiveMessages("call is up");
    setCallSet(true);
	}

	const playRemoteStream = (stream) => {
    setRemoteStream(stream); 
	}

	const getPeerID = () => {
		Peer.getID(set_id, setExternal_id, receiveMessages, connectionIsUp, setRemoteStream, localStream, setCallSet, connectionClosed);
	}

	const connectChat = (another) => {
	  Peer.connectToID(another,receiveMessages, connectionIsUp, connectionClosed);
	};

	const closeChat = () => {
	  Peer.closeChat(setChatSet);
	}

	const connectCall = (another) => {
	  Peer.callToID(another,setRemoteStream, localStream, callIsUp );
	};

	const connectionClosed = () => {
    setChatSet(false);

	};

	const closeCall = () => {
	  Peer.closeCall(setCallSet);
	};


	const disconnectPeer = () => {
    Peer.disconnect();
		set_id("");
    endSession();
		set_idSet(false);
	};

  const returnStream = (stream) => {
		console.log("local stream returned to app");
		setLocalStream(stream);
	};


	//render
  if(!user.id){
	  return(
	  <Login 
			  user={user}
		  setUser={setUser}	
			  userSet={userSet}
				setUserSet={setUserSet}
		/>
		);
	}

  if(!hide){
	  return(

		<div key={msg}>
			<button 
				onClick={ () => setHide(true) }
			>
			  Hide 
			</button>
			<User
			  user={user}
			  setUser={setUser}
			  userSet={userSet}
				setUserSet={setUserSet}
			/>
			<PeerID
			  id={id}
        idSet={idSet}
			  getPeerID={getPeerID}
			  online={idSet}
			  disconnect={disconnectPeer}
			/>
			<Channel 
			  id={id}
        selectPeer={updateE_id}
        idSet={idSet}
			/>
			<ExternalID
			  updateE_id={updateE_id}
			  external_id={external_id}
			  chatSet={chatSet}
        connectChat={connectChat}
			  connectCall={connectCall}
        closeChat={closeChat}
			  callSet={callSet}
			  closeCall={closeCall}
			/>
      <MsgList
        msg={msg}
			/>
			{newMsg} <input type="text" value={tmpMsg} onChange={ (e) => setTmpMsg(e.target.value) } />  = {tmpMsg} <button onClick={() => sendMessages(tmpMsg)}> send </button> 
			<br />
      <VideoCall
			  stream={remoteStream}
			  isRemote={true}
			  callSet={callSet}
			  start={start}
			  setStart={setStart}
			/>
      <VideoCall
			  returnStream={returnStream}
			  isRemote={false}
			  start={start}
			  setStart={setStart}
			/>

		</div>
	  )
	 } else {
		 return(
			 <div>
			   <button  
			     onClick={() => setHide(false)}
			   >
         Show
			   </button>

			<br />
      <VideoCall
			  stream={remoteStream}
			  isRemote={true}
			  callSet={callSet}
			  start={start}
			  setStart={setStart}
			/>
      <VideoCall
			  returnStream={returnStream}
			  isRemote={false}
			  start={start}
			  setStart={setStart}
			/>
		   </div>
		 );
	 }
}

export default App;

