import React from 'react';

const User = ({setUser, user, userSet, setUserSet}) => {

	//render
  if(true ||userSet === false){
    return (
		  <div  className="padding border" >
			   unset
			</div>
		);
	}else{
    return (
	  	<div  className="padding border" > 
			  user = { //user.username || "no user"
				}
			</div>
		);
	}
	return null;

};

export default User;

