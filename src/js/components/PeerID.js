import React from 'react';

const PeerID = ({ id, idSet, getPeerID }) => {

	//render
	if(idSet == false){
    return (
		  <div  className="padding border" > 
			local_id = {id} <button onClick={ () => getPeerID() } > Connect </button> 
			</div>
		);
	}else{
    return (
			<div  className="padding border" >
			local_id = <a className="peer_id" href={"?id="+id}>{id}</a>
			</div>
		);
	}

};

export default PeerID;


