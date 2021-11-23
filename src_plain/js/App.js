
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
  const [hide, setHide] = useState(false);
  const [user, setUser] = useState({});
  const [userSet, setUserSet] = useState(false);
  const [session, setSession] = useState({});

  const [external_id, setExternal_id] = useState("");
  const [external_user, setExternal_user] = useState("");
  const [id, set_id] = useState("");
  const [idSet, set_idSet] = useState(false);

  const [msg, setMsg] = useState([]);
  const [chatSet, setChatSet] = useState(false);
  const [tmpMsg, setTmpMsg] = useState("");
	const [newMsg, setNewMsg] = useState(0);
	const [inNewMsg, setInNewMsg] = useState("");

  const [start, setStart] = useState(false);
  const [remoteStream, setRemoteStream] = useState(false);
  const [localStream, setLocalStream] = useState(false);
  const [localStreamSet, setLocalStreamSet] = useState(false);
  const [callSet, setCallSet] = useState(false);
  const [callIn, setCallIn] = useState(false);
  const [callOut, setCallOut] = useState(false);

	//SESSION
	const setResponse = ( response ) => {
    //console.log("session response from httpGet", response);
		if(response.status === "ok"){
			//console.log("session response ok");
      setSession(response.data);
		}else{
			setSession({});
		}
	}

	const startSession = () => {
		const query = "add&&email="+user.email+"&peer_id="+id+"&username="+user.username;
		if(user.email)
	  httpGet(setResponse, query, "peerjs/sessions");
	};

	const endSession = () => {
		const query = "remove&&email="+user.email+"&peer_id="+id+"&online=true";
	  httpGet(setResponse, query, "peerjs/sessions");
	};

	useEffect(() => {
		console.log('CALLING in? callIn, localStream', callIn, localStream);
		const call_in = window.call;	
		if(call_in && callIn){
				call_in.answer(localStream); // Answer the call with an A/V stream.
				call_in.on('stream', setRemoteStream);
			setCallSet(true); 
		}
	}, [ callIn ] );

	useEffect(() => {
		console.log('CALLING out? callOut, localStream', callOut, localStream);
		const call_out = window.call;	
		if(call_out && callOut){
				//call_in.answer(localStream); // Answer the call with an A/V stream.
				//call_in.on('stream', setRemoteStream);
		}
	}, [ callOut ] );

	useEffect(() => {
		//console.log('user changed', user);
		if(id === "" && user.email !== undefined){
			
		  //console.log('user email', user.email);
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
		//console.log("id changed", id);
		if(id !== ""){
			set_idSet(true);
		  //start session
      startSession();
		}else{
      set_idSet(false);
		}
	}, [id] );

	useEffect(() => {
		//console.log("EXTERNALID CHANGED TO", external_id);
		if(external_id !== ""){
      updateQS(external_id);
			return;
		}
    var loadID = "";
	  var url = window.location.href;       
		var urlSplit = url.split( "?" );       
		if(urlSplit[1]) { 
			loadID = urlSplit[1].replace( "id=", "" );
			if(loadID) setExternal_id(loadID);
		}
	}, [external_id] );
	
	useEffect(() => {
			console.log("use effect START CALL??? " , start, external_id); // this prints the updated value
	}, [ start ]); // this will be triggered only when state value is different
	
	useEffect(() => {
		console.log("use effect START localStream callIn" , localStream, callIn ); // this prints the updated value
		if(localStream && callIn){
		console.log("use effect ATTACHING ON CALL" , localStream, callIn, peer ); // this prints the updated value
			window.peer.on('call', onCall);//end peer.on("open")
		}
		//if(start && external_id !== "")
	  //  Peer.callToID(external_id,setRemoteStream, localStream, callIsUp, setCallSet );
	}, [  localStream, callIn ]); // this will be triggered only when state value is different

	useEffect(() => {
		console.log("use effect START localStreamSet, callIn " , localStreamSet, callIn ); // this prints the updated value
    if(localStreamSet && callIn){
			sendControllMsg("accept_call");
		}
		//if(start && external_id !== "")
	  //  Peer.callToID(external_id,setRemoteStream, localStream, callIsUp, setCallSet );
	}, [ localStreamSet, callIn ]); // this will be triggered only when state value is different

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
    if(chatSet){
		  //console.log('effect incomming open detected ',id);
		  if(id && id != "" && id !== undefined)
		    sendMessages('open chat '+id );
		}
	}, [ chatSet ]); // this will be triggered only when state value is different

	useEffect(() => {
    if(callOut && start && localStreamSet && !callSet && localStream){
		  console.log('effect outgoing call  detected ',id, " to ", external_id, "localS", localStream);
		  if(id && id != ""){
		    sendMessages('open actual peer call from'+id);
	      Peer.callToID(external_id, setRemoteStream, localStream, callIsUp, setCallSet );

			}
		}
	}, [  callOut, start , localStreamSet, localStream ]); // this will be triggered only when state value is different

	useEffect(() => {

		  console.log('effect incomming call  remoteStream changed ',remoteStream, "CallSet",callSet);
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
        //prepare to call as receiver is ready 
				if(!start)setStart(true);
				setCallOut(true);
			}
      if(msg_in.content === "call"){
				//prepare receiving a call as its being requested
				if(!start)setStart(true);
				setCallIn(true);
        //sendControllMsg("accept_call");

			}
      if(msg_in.content === "end_call"){
	      Peer.closeCall(setCallSet);
				setCallOut(false);
				setCallIn(false);
				setStart(false);
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

  const connectionIsUp = (external) => {
		//setExternal_id(external);
    receiveMessages({type:"message", content: "connection is open"});
    setChatSet(true);
	}

	const callIsUp = () => {
    receiveMessages({type:"message", content: "call is up"});
    setCallIn(true);
	}

	const playRemoteStream = (stream) => {
    setRemoteStream(stream); 
	}

	const onCall = (call_in) => {
				//var localStream = functionsP.getLocalStream();
				if(localStream === null){
					alert("no local stream");
				}
				console.log('AAAAAA incomming call detected and passing local stream (Answer)',call_in,localStream);
				//call = call_in;
		setCallIn(true);
		window.call = call_in;
		call.answer(localStream);
		call.on('stream', function(stream) {
			setRemoteStream(stream);
		})
				//BUG IN PEERJS close on call never fire
				/*
				call.on('close', () => {
					console.log('incomming call stream CLOSE detected');
					setRemoteStream(false);
					setCallSet(false);
				});
				*/
	};

	const getPeerID = () => {
		Peer.getID(set_id, setExternal_id, receiveMessages, connectionIsUp, setRemoteStream, getLocalStream, setCallSet, connectionClosed, onCall);
	}

	const connectChat = (another) => {
	  Peer.connectToID(another,receiveMessages, connectionIsUp, connectionClosed, user);
	};

	const closeChat = () => {
	  Peer.closeChat(setChatSet);
	}
  const requestRemoteCall = () => {
    sendControllMsg("call");
	};

	const connectCall = (another) => {
		console.log("REQUESTIN A CALL");
    requestRemoteCall();
	  //Peer.callToID(another,setRemoteStream, localStream, callIsUp, setCallSet );
	};


	const connectionClosed = () => {

		console.log("connectionClosed");
    setChatSet(false);

	};

	const closeCall = () => {
	  Peer.closeCall(setCallSet);
				setCallOut(false);
				setCallIn(false);
				setStart(false);

    sendControllMsg("end_call");
	};


	const disconnectPeer = () => {
    Peer.disconnect();
		set_id("");
    endSession();
		set_idSet(false);
	};

  const returnStream = (stream) => {

		console.log("local:",localStream, "new local stream returned to app so its not null??", stream);
		if(stream === null)
      setLocalStreamSet(false);
		else
      setLocalStreamSet(true);

		setLocalStream(stream);
	};

	const getLocalStream = () => {
		console.log("BBBBB local stream returnin to peer answer  so its not null", localStream);
		return localStream;
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

		<div key={msg} >
		  <div  className="controlls">
				<User
					user={user}
					setUser={setUser}
					userSet={userSet}
					setUserSet={setUserSet}
				/>
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
			</div>
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
        setExternal_user={setExternal_user}
        idSet={idSet}
			  session={session}
			/>
			<ExternalID
			  updateE_id={updateE_id}
			  external_id={external_id}
			  external_user={external_user}
			  chatSet={chatSet}
        connectChat={connectChat}
			  connectCall={connectCall}
        closeChat={closeChat}
			  callSet={callSet}
			  closeCall={closeCall}
			/>
			{
				chatSet &&
				<div>
					<MsgList
						msg={msg}
					/>
					<div className="messageIn">
					{newMsg} <input type="text" value={tmpMsg} onChange={ (e) => setTmpMsg(e.target.value) } />  = {tmpMsg} <button onClick={() => sendMessages(tmpMsg)}> send </button> 
					</div>
					<br />
		  	</div>
			}
			{
				remoteStream &&
      <VideoCall
			  id="Remote_video"
			  stream={remoteStream}
			  isRemote={true}
			  setLocalStreamSet={null}
			  start={start}
			  setStart={setStart}
			  callSet={callSet}
			/>
			}
			{
				//localStream || start &&
      <VideoCall
			  id="Local_video"
			  stream={localStream}
			  returnStream={returnStream}
			  isRemote={false}
			  start={start}
			  setStart={setStart}
			  setLocalStreamSet={setLocalStreamSet}
			  callSet={callSet}
			/>
			}
			{
				/*
		<pre>
			const [user, setUser] = useState({JSON.stringify(user)});<br />
			const [userSet, setUserSet] = useState({userSet?"true":"false"});<br />
			const [session, setSession] = useState({JSON.stringify(session)});<br />
			const [id, set_id] = useState({id});<br />
			const [idSet, set_idSet] = useState({idSet?"true":"false"});<br />

			const [external_id, setExternal_id] = useState({external_id});<br />

			const [hide, setHide] = useState({hide?"true":"false"});<br />
			const [msg, setMsg] = useState({JSON.stringify(msg)});<br />
			const [start, setStart] = useState({start?"true":"false"});<br />
			const [chatSet, setChatSet] = useState({chatSet?"true":"false"});<br />
			const [tmpMsg, setTmpMsg] = useState({tmpMsg});<br />
			const [newMsg, setNewMsg] = useState({newMsg});<br />
			const [inNewMsg, setInNewMsg] = useState({inNewMsg});<br />
			const [remoteStream, setRemoteStream] = useState({remoteStream?JSON.stringify(remoteStream.id):"null"});<br />
			const [localStream, setLocalStream] = useState({localStream?JSON.stringify(localStream.id):"null"});<br />
			const [localStreamSet, setLocalStreamSet] = useState({localStreamSet?"true":"false"});<br />
			const [callSet, setCallSet] = useState({callSet?"true":"false"});<br />
			const [callIn, setCallIn] = useState({callIn?"true":"false"});<br />

			const [callOut, setCallOut] = useState({callOut?"true":"false"});
		</pre>
		  */
			}
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
		   </div>
		 );
	 }
}

export default App;

