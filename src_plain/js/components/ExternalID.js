import React from 'react';

const ExternalID = ({ updateE_id, external_id, chatSet, connectChat, connectCall, closeChat, callSet, closeCall }) => {

	const printChat = () => {
	  if(chatSet == false){
      return (
				<div>
			  <input type="text" value={external_id} onChange={ (e) => updateE_id(e.target.value) } /> external_id = {external_id} 
			  <button onClick={() => connectChat(external_id)}> Chat </button> 
				</div>
		  );
	  }else{
      return (
			  <div>
			connected to {external_id} chat.	
			<button onClick={() => closeChat()}>Close Chat </button> 
		    </div>
			);
	  }
	};

	const printCall = () => {
	
	  if(callSet == false){
      return (
				<button onClick={() => connectCall(external_id)}> Call </button> 

			);
		}else{
      return (
	      <div>
				  in call with {external_id}. 
			    <button onClick={() => closeCall()}> End Call </button> 
				</div>
			);
		}
	};


 	//render
  return (
			<div className="padding border" >
			  { printChat() }
	      { printCall() }
			</div>

	);
 
};

export default ExternalID;
