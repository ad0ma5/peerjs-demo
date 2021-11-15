import React, { useRef, useEffect, useState } from 'react';
import Register from "./Register.js";
import httpGet from "../httpGet.js";

const Login = ({setUser, user, userSet, setUserSet }) => {

  //const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [reg, setReg] = useState(false);
  const [loginError, setLoginError] = useState("");
  
	const setResponse = ( response ) => {
    console.log("response from httpGet", response);
		if(response.status === "ok"){
      setUser(response.data);
			setUserSet(true);
		}else{
      setLoginError("Login failed, please try again or register if dont have valid account.");
		}
	}
	const login = () => {
    const query = "login&&email="+email+"&pass="+pass;
	  httpGet(setResponse, query, "peerjs/accounts");
	};

	if(reg){
	  return (
		<div  className="padding border" >
			<Register
			  setReg={setReg}

			  user={user}
		    setUser={setUser}	
			  userSet={userSet}
				setUserSet={setUserSet}
			/>
		</div>
	  );
	}
  else
	return (
		<div  className="padding border" >
		  <div>
		  Login: 
		  </div>
		  <input 
		    placeholder="Email"
		    type="text" 
		    value={email} 
		    onChange={ (e) => setEmail(e.target.value) } 
		  />  
			<input type="text" 
		    placeholder="Password"
		    value={pass} 
		    onChange={ (e) => setPass(e.target.value) } 
		  />  
		  <button 
		    onClick={ () => login()} 
		  > Login </button> 
		  <button 
		    onClick={ () => setReg(true)} 
		  > Register </button> 
		  { loginError }	
		</div>
	);
}

export default Login;
