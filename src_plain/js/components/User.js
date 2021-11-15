import React from 'react';

const User = ({setUser, user, userSet, setUserSet}) => {

	//render
  if(userSet === false){
    return (
		  <div  className="padding border" >
			</div>
		);
	}else{
    return (
	  	<div  className="padding border inline" > 
			  username = {user.username}
			</div>
		);
	}
	return null;

};

export default User;

