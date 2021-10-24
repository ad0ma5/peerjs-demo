import React, { useRef, useEffect } from 'react';

const VideoCall = ({remoteStream, localStream,  callSet}) => {

  const refVideoIn = useRef(null);
  const refVideoOut = useRef(null);

	useEffect(() => {
			if(!callSet) return
console.log('effect',refVideoIn ,refVideoOut );
			    if (!refVideoIn.current) return
			    refVideoIn.current.srcObject = remoteStream;
			    refVideoIn.current.A = "OK";
			    if (!refVideoOut.current) return
			    refVideoOut.current.srcObject = localStream;
			    refVideoOut.current.A = "OK";
			  }, [callSet])
	//render
	//if(chatSet == false){
    return (
			<div className="padding border" >
			  { !callSet ? "NO CALL" : "IN CALL" }
				<div className="inline">
					<div>video_out</div>
			    {  
					<video id="video_out" ref={refVideoOut} onLoadedMetadata={()=>{this.play();this.mute()}}></video>
					}
				</div>
				<div className="inline">
					<div>video_in</div>
			    {   
					<video id="video_in" ref={refVideoIn} onLoadedMetadata={()=>{this.play();}}></video>
					}
				</div>
			</div>
		);
	/*
	}else{
    return (
			<div  className="padding border" > 
			connected to {external_id} chat.	<button> Call </button> 
			</div>
		);
	}
*/
};

export default VideoCall;

