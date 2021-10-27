import React, { useRef, useEffect, useState } from 'react';

const Login = ({setUser, user, userSet, setUserSet}) => {

  //const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");

	return (
		<div  className="padding border" >
			<input type="text" 
		    value={pass} 
		    onChange={ (e) => setUser(e.target.value) } 
		  /> pass = {pass} <button 
		      //onClick={ () => setUserSet(true) } 
		  > Set </button> 
			
		  <input 
		    type="text" 
		    value={email} 
		    onChange={ (e) => setEmail(e.target.value) } 
		  /> email = {email} <button 
		    onClick={ () =>  } 
		  > Login </button> 
		</div>
	);
}

export default Login;
