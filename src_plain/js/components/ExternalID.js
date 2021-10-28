import React from 'react';

const ExternalID = ({ updateE_id, external_id, chatSet, connectChat, connectCall, closeChat }) => {

	//render
	if(chatSet == false){
    return (
			<div className="padding border" >
			  <input type="text" value={external_id} onChange={ (e) => updateE_id(e.target.value) } /> external_id = {external_id} 
			  <button onClick={() => connectChat(external_id)}> Chat </button> 
				<button onClick={() => connectCall(external_id)}> Call </button> 
			</div>
		);
	}else{
    return (
			<div  className="padding border" > 
			connected to {external_id} chat.	
			<button onClick={() => closeChat(external_id)}>Close Chat </button> 
			<button onClick={() => connectCall(external_id)}> Call </button> 
			</div>
		);
	}

};

export default ExternalID;
