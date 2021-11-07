
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
	//console.log("App.js");

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
  const [localStreamSet, setLocalStreamSet] = useState(false);
  const [callSet, setCallSet] = useState(false);
  const [session, setSession] = useState({});

	const setResponse = ( response ) => {
    console.log("session response from httpGet", response);
		if(response.status === "ok"){
			console.log("session response ok");
      setSession(response.data);
		}else{
			setSession({});
		}
	}

	const startSession = () => {
		const query = "add&&email="+user.email+"&peer_id="+id+"&online=true";
		if(user.email)
	  httpGet(setResponse, query, "peerjs/sessions");
	};

	const endSession = () => {
		const query = "remove&&email="+user.email+"&peer_id="+id+"&online=true";
	  httpGet(setResponse, query, "peerjs/sessions");
	};

	useEffect(() => {
		console.log('user changed', user);
		if(id === "" && user.email !== undefined){
			
		  console.log('user email', user.email);
			getPeerID();
		}
	}, [ user ] );

	useEffect(() => {
		console.log("APP LOADED");
		return () => {
		  console.log("APP UNLOADED");
		}
	}, [] );

	useEffect(() => {
		if(session !== {}){
		  window.addEventListener("beforeunload", logout);
	  }else{
	    window.removeEventListener("beforeunload", logout);
		}

	}, [session] );

	useEffect(() => {
		console.log("id changed", id);
		if(id !== ""){

			set_idSet(true);
		  //start session
      startSession();
		}else{
      set_idSet(false);
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
			console.log("use effect START CALL" , start, external_id); // this prints the updated value
	}, [ start ]); // this will be triggered only when state value is different
	
	useEffect(() => {
		console.log("use effect START localStreamSet" , localStreamSet ); // this prints the updated value
		//if(start && external_id !== "")
	  //  Peer.callToID(external_id,setRemoteStream, localStream, callIsUp, setCallSet );
	}, [ localStreamSet ]); // this will be triggered only when state value is different

	useEffect(() => {
		if( inNewMsg ){
			//console.log("use effect msg" , msg, inNewMsg); // this prints the updated value
			const m = msg.slice(); //[...msg];
			m.push("\n< "+inNewMsg);
			console.log("RECEIVE msg effect",m,  msg );
			setMsg(m);	
			const nm = newMsg+1;
			setNewMsg(nm);
		}
	}, [ inNewMsg  ]); // this will be triggered only when state value is different

	useEffect(() => {
    if(callSet){
		  console.log('effect incomming open detected ',id);
		  if(id && id != "")
		    sendMessages('open chat'+id );
		}
	}, [ chatSet ]); // this will be triggered only when state value is different

	useEffect(() => {
    if(callSet){
		  console.log('effect incomming call  detected ',id);
		  if(id && id != "")
		    sendMessages('open call '+id);
		}
	}, [  callSet /*, localStream*/ ]); // this will be triggered only when state value is different

	useEffect(() => {

		  console.log('effect incomming call  remoteStream changed ');
		if(remoteStream) setCallSet(true);
	}, [  remoteStream/*, localStream*/ ]); // this will be triggered only when state value is different

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
		console.log("RECEIVE",msg_in, msg, typeof msg_in);
		if(typeof msg_in === "string")
		try{ msg_in = JSON.parse(msg_in); }catch(err){console.log(err);}
		if(msg_in.type === "message")
			console.log("message add to list", msg_in);
      setInNewMsg(msg_in.content);
		if(msg_in.type === "controll"){
      if(msg_in.content === "accept_call"){

				setStart(true);
				setCallSet(true); 
			}
      if(msg_in.content === "call"){
				setStart(true);
        sendControllMsg("accept_call");

			}
      if(msg_in.content === "end_call"){

	      Peer.closeCall(setCallSet);
			}

		}
	};

	const sendMessages = (msg_in) => {
		console.log("SEND",msg_in, msg);
	  Peer.sendMessage(JSON.stringify({type:"message",content: msg_in}));
	  const m = msg.slice(); // [...msg];
		m.push("\n> "+msg_in);
		setMsg(m);
    setTmpMsg("");
		const nm = newMsg+1;
    setNewMsg(nm);
	};

	const sendControllMsg = (msg_in) => {
		console.log("SEND CONTROLL",msg_in);
	  Peer.sendMessage(JSON.stringify({type:"controll",content: msg_in}));
	};

  const connectionIsUp = () => {
    receiveMessages({type:"message", content: "connection is open"});
    setChatSet(true);
	}

	const callIsUp = () => {
    receiveMessages({type:"message", content: "call is up"});
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
  const requestRemoteCall = () => {
    sendControllMsg("call");
	};

	const connectCall = (another) => {
			console.log("REQUESTIN A CALL");
    //requestRemoteCall();
	    Peer.callToID(another,setRemoteStream, localStream, callIsUp, setCallSet );
	};

	const connectionClosed = () => {
    setChatSet(false);

	};

	const closeCall = () => {
	  Peer.closeCall(setCallSet);

    sendControllMsg("end_call");
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

	const logout = () => {
		console.log("logout", session, user)
		if (session !== {} && id !== "") disconnectPeer();
	  if (user.id) setUser({});
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
			<button 
				onClick={ () => logout() }
			>
			  Logout 
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
			  session={session}
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
			  id="Remote_video"
			  stream={remoteStream}
			  isRemote={true}
			  setLocalStreamSet={setLocalStreamSet}
			  start={start}
			  setStart={setStart}
			/>
      <VideoCall
			  id="Local_video"
			  returnStream={returnStream}
			  isRemote={false}
			  start={start}
			  setStart={setStart}
			  setLocalStreamSet={setLocalStreamSet}
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
			<button 
				onClick={ () => logout() }
			>
			  Logout 
			</button>

			<br />
      <VideoCall
			  stream={remoteStream}
			  isRemote={true}
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

