import React from 'react';

const ExternalID = ({ updateE_id, external_id, external_user, chatSet, connectChat, connectCall, closeChat, callSet, closeCall }) => {

	const printChat = () => {
	  if(chatSet == false){
      return (
				<div className="inline">
			  external_id = <input className="inline" type="text" value={external_id} onChange={ (e) => updateE_id(e.target.value) } />  { external_user } 
			  <button className="inline" onClick={() => connectChat(external_id)}> Chat </button> 
				</div>
		  );
	  }else{
      return (
			  <div>
			connected to  { external_user } {external_id} chat.	
			<button  className="inline" onClick={() => closeChat()}>Close Chat </button> 
		    </div>
			);
	  }
	};

	const printCall = () => {
	
	  if(callSet == false){
      return (
				<button className="inline"  onClick={() => connectCall(external_id)}> Call </button> 

			);
		}else{
      return (
	      <div>
				  in call with {external_id}. 
			    <button  className="inline" onClick={() => closeCall()}> End Call </button> 
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
