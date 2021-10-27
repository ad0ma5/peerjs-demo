import React from 'react';

const User = ({setUser, user, userSet, setUserSet}) => {

	//render
  if(userSet === false){
    return (
		  <div  className="padding border" >
		    <input type="text" value={user} onChange={ (e) => setUser(e.target.value) } /> user = {user} <button onClick={ () => setUserSet(true) } > Set </button> 
			</div>
		);
	}else{
    return (
	  	<div  className="padding border" > 
			  user = {user}
			</div>
		);
	}
	return null;

};

export default User;

