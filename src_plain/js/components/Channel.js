import React, { useRef, useEffect, useState } from 'react';

import httpGet from "../httpGet.js";

const Channel = ({selectPeer, id, idSet}) => {
	
  const [channel, setChannel] = useState({});

	const printChannels = (ch) => {
		console.log("channels list" , ch, channel, Object.keys(ch));
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
    console.log("response from httpGet", response);
		if(response.status === "ok"){
      setChannel(response.data.accounts);
		}
	}
	
	const getChannel = () => {
    const query = "get";
	  httpGet(setResponse, query, "sessions");
	}

	useEffect(() => {

    if(Object.keys(channel) < 1){
		  console.log('channel et fired',channel, id);
			getChannel();
		}
		console.log('channel changed',channel, id);
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


