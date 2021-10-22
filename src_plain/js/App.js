
import React, { useEffect, useState } from 'react';
import Peer from './Peer.js';

const  App = () => {
  // Declare a new state variable, which we'll call "count"
  const [user, setUser] = useState("");
  const [userSet, setUserSet] = useState(false);
  const [external_id, setExternal_id] = useState("");
  const [id, set_id] = useState("");
  const [idSet, set_idSet] = useState(false);
  const [hide, setHide] = useState(false);
  const [msg, setMsg] = useState([]);
  const [chatSet, setChatSet] = useState(false);
  const [tmpMsg, setTmpMsg] = useState("");

	useEffect(() => {
    var loadID = "";
	  var url = window.location.href;       
		var urlSplit = url.split( "?" );       
		if(urlSplit[1]) { 
			loadID = urlSplit[1].replace( "id=", "" );
			if(loadID) setExternal_id(loadID);
		}

	}, [external_id] );
	
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
	  var m = msg;
		m.push("\n< "+msg_in);
		setMsg(m);	
	};
  
	const sendMessages = (msg_in) => {
	  Peer.sendMessage(msg_in);
	  var m = msg;
		m.push("\n< "+msg_in);
		setMsg(m);
    setTmpMsg("");
	};

  const connectionIsUp = () => {
    setChatSet(true);
	}

	const getPeerID = () => {
		var l_id = Peer.getID(receiveMessages, connectionIsUp);
		if(l_id){
      set_id(l_id);
			set_idSet(true);
		}
	}

	const connectChat = (another) => {
	  Peer.connectToID(another,receiveMessages);
	};

	//render
  if(userSet == false){
    return (
		<div>
		  <h3  className="padding border" >
		    <input type="text" value={user} onChange={ (e) => setUser(e.target.value) } /> user = {user} <button onClick={ () => setUserSet(true) } > Set </button> 
			</h3>
		</div>
		);
	}

	if(idSet == false){
    return (
		<div>
	  	<h3  className="padding border" > user = {user}</h3>
		  <h3  className="padding border" > local_id = <a id="" href=""></a>{id} <button onClick={ () => getPeerID() } > Connect </button> </h3>
		</div>
		);
    
	}
  if(!hide){
	  return(

		<div>
			<h3  className="padding border" > user = <a id="" href=""></a>{user}</h3>
			<h3  className="padding border" > local_id = <a id="peer_id" href={"?id="+id}>{id}</a></h3>
			<h3  className="padding border" >
			  <input type="text" value={external_id} onChange={ (e) => updateE_id(e.target.value) } /> external_id = {external_id} <button> Call </button> <button onClick={() => connectChat(external_id)}> Chat </button> 
			</h3>
			
			<button 
				onClick={ () => setHide(true) }
			>
			Hide 
			</button>
			<textarea>
			{
				/*
         msg.length === 0 ? null : msg.map( (m) =>
					  {return m}            
				 )
				 */
			}
			</textarea>
			  <input type="text" value={tmpMsg} onChange={ (e) => setTmpMsg(e.target.value) } />  = {tmpMsg} <button onClick={() => sendMessages(tmpMsg)}> send </button> 
		</div>
	 );
	 } else {
		 return(
			 <div onClick={() => setHide(false)}>
         Show
		   </div>
		 );
	 }
}

export default App;

