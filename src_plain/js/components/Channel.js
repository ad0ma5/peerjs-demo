import React, { useRef, useEffect, useState } from 'react';

import httpGet from "../httpGet.js";
var interval = null;
const Channel = ({selectPeer, id, idSet}) => {
	
  const [channel, setChannel] = useState({});

	const printChannels = (ch) => {
		//console.log("channels list" , ch, channel, Object.keys(ch));
	  return Object.keys(ch).map( key => {

      return (
			  <button 
				  key={key} 
				  onClick={() =>{ selectPeer(ch[key].peer_id ); console.log('clickinnn'); }}
				>{ ch[key].email } { ch[key].peer_id }</button>
			);
		});
	}

	const setResponse = ( response ) => {
    //console.log("response from httpGet", response);
		if(response.status === "ok"){
      setChannel(response.data.accounts);
		}
	}
	
	const getChannel = () => {
    const query = "get";
	  httpGet(setResponse, query, "sessions");
	}

	if(id !== "")
	if(interval === null){
		interval = setInterval(function(){ 
			//console.log("Hello"); 
			getChannel();
    }, 30000);
	  //console.log("started interval", interval);
	}

	useEffect(() => {
		return () => {
			//console.log('unmount channel clear interval=',interval);
			clearInterval(interval);
			interval = null;
		};
	}, []);

	useEffect(() => {
    if(Object.keys(channel).length < 1 && id !== ""){
		  //console.log('channel et fired',channel, id);
			getChannel();
		}
		else if(id === "" && Object.keys(channel).length > 0 ){
		  //console.log('channel empty fired',channel, id);
      setChannel({});
		}else{
			//console.log('third option',id === "",  Object.keys(channel).length  );
		}
		//console.log('channel changed',channel, id);
	}, [channel, id] );


	//if(idSet)
	return (
		<div  className="padding border" >
		  Channel
		  <div  className="padding border" >
		    { printChannels(channel) }
		  </div>
		</div>
	);
  return null;
};

export default Channel;


