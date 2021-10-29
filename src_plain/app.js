//import 'babel-polyfill';
import React from "react";
import ReactDOM from "react-dom";
import App from "./js/App.js"; 

var root = document.getElementById('root');
ReactDOM.render(<App {...(root.dataset)} />, root);

const doIt = (e) => console.log(e, "focus");
var seen = 1;
if(seen === 1){
	seen++;
//window.addEventListener("focusin", console.log);
//window.addEventListener("focusout", console.log);
}
