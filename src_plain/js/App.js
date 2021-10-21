
import React, { useEffect, useState } from 'react';

const  App = () => {
  // Declare a new state variable, which we'll call "count"
  const [external_id, setExternal_id] = useState("");
  const [id, set_id] = useState("");
  const [hide, setHide] = useState(false);
	
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

	useEffect(() => {
    var loadID = "";
	  var url = window.location.href;       
		var urlSplit = url.split( "?" );       
		if(urlSplit[1]) { 
			loadID = urlSplit[1].replace( "id=", "" );
			if(loadID) setExternal_id(loadID);
		}

	}, [external_id] );
  if(!hide){
	  return(

		<div>
		<h3  className="padding border" ><input type="text" value={external_id} onChange={ (e) => updateE_id(e.target.value) } /> external_id = <a id="peer_id" href=""></a>{external_id} <button> Call </button> </h3>
		<h3  className="padding border" ><input type="text" value={id} onChange={ (e) => set_id(e.target.value) } /> local_id = <a id="peer_id" href=""></a>{id} <button> Share </button> </h3>
		
		<button 
		  onClick={ () => setHide(true) }
		>
		Hide 
		</button>
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

