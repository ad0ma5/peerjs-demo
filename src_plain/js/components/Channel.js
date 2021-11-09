import React, { useRef, useEffect, useState } from 'react';

import httpGet from "../httpGet.js";
var interval = null;

const Channel = ({selectPeer, id, idSet, session}) => {
	
  const [channel, setChannel] = useState({});

	const getTimeDiff = (timestamp) => {
    const dt = Date.now() - timestamp;
    return " connected "+parseInt(dt/1000)+" seconds ago";

	};

	const printChannels = (ch) => {
		//console.log("channels list" , ch, channel, Object.keys(ch));
	  return Object.keys(ch).map( key => {

      return (
			  <div 
				  key={key} 
				  onClick={() =>{ selectPeer(ch[key].peer_id ); console.log('clickinnn'); }}
				  title={ ch[key].peer_id }
				  className="underline"
				>
				  [{ ch[key].email }] --- { getTimeDiff(ch[key].id) }
				</div>
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
	  httpGet(setResponse, query, "peerjs/sessions");
	}

	if(id !== "")
	if(interval === null){
		interval = setInterval(function(){ 
			//console.log("Hello"); 
			getChannel();
    }, 300 *1000);
	  //console.log("started interval", interval);
	}

	useEffect(() => {
		if(id !== "")
		return () => {
			//console.log('unmount channel clear interval=',interval);
			clearInterval(interval);
			interval = null;
		};
	}, [], id);

	useEffect(() => {
    if(Object.keys(channel).length < 1 && id !== "" && session?.id !== undefined){
		  //console.log('channel et fired',channel, id, session);
			getChannel();
		}
		else if(id === "" && Object.keys(channel).length > 0 ){
		  //console.log('channel empty fired',channel, id);
      setChannel({});
		}else{
			//console.log('third option',id === "",  Object.keys(channel).length  );
		}
		//console.log('channel changed',channel, id);
	}, [channel, id, session] );


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


