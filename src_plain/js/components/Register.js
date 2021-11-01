import React, { useRef, useEffect, useState } from 'react';

import httpGet from "../httpGet.js";

const Register = ({setUser, user, userSet, setUserSet, setReg}) => {

  //const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  
  
	const setResponse = ( response ) => {
    console.log("response from httpGet", response);
		if(response.status === "ok"){
      setUser(response.data);
			setUserSet(true);
		}
	}
	
	const register = () => {
    const query = "add&username="+username+"&email="+email+"&pass="+pass;
	  httpGet(setResponse, query, "peerjs/accounts");
	};

	return (
		<div  className="" >
		 Register
		  <input 
		    type="text" 
		    placeholder="Email"
		    value={email} 
		    onChange={ (e) => setEmail(e.target.value) } 
		  />  
			<input type="password" 
		    placeholder="Password"
		    value={pass} 
		    onChange={ (e) => setPass(e.target.value) } 
		  />  
			<input type="text" 
		    placeholder="Username"
		    value={username} 
		    onChange={ (e) => setUsername(e.target.value) } 
		  />  
		  <button 
		    onClick={ () => setReg(false)} 
		  > Back to Login </button> 
		  <button 
		    onClick={ () => register()} 
		  > Register </button> 
			
		</div>
	);
}

export default Register;
