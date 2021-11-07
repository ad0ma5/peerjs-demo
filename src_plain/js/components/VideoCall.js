import { useState, useEffect, useRef } from 'react'


export default function VideoCall({stream, returnStream, isRemote, setLocalStreamSet, start, setStart, ...props }) {
  const [sObject, setSObject] = useState(false);
  const [sObjectA, setSObjectA] = useState(false);
	  const refVideo = useRef(null)

	  useEffect(() => {
			if(!start) return
			console.log('video effect',refVideo ,refVideo.current );
			if (!refVideo.current) return
			if(!sObject) return
			refVideo.current.srcObject = sObject;
			refVideo.current.A = "OK";
      console.log(isRemote,'video effect set',refVideo);

			if(!isRemote) 
			refVideo.current.muted = true;
		}, [sObjectA])

	  useEffect(() => {
			if(stream && isRemote) {
				setStart(true);
				handleVideo(stream);
				return;
			}
			if(!isRemote){
			  if(!start && refVideo.current){
					//console.log([refVideo, sObject]);
   
					if(sObject && sObject[0])
					sObject[0].current.close();
				  if( sObject ) sObject.getTracks().forEach(function(track) {
			      if (track.readyState == 'live') {
				      track.stop();
				    }
			    });
			    refVideo.current.srcObject = null;
          setSObjectA(false);
				  //refVideo.current.stop();	
					return
				}else{
					console.log('mount local video');
					navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
					if (navigator.getUserMedia) {
						navigator.getUserMedia({video: true, audio: true}, handleVideo, videoError);
					}//end navigator
				}// end if !start
			}//end if remote
		}, [start]);

  	const handleVideo = (stream)=>{
			//if(!start) return
      console.log('handleVideo isRemote', isRemote);
			    // Update the state, triggering the component to re-render with the correct stream
      setSObject(stream);
      setSObjectA(true);
			if(!isRemote){
				returnStream(stream);
				//setLocalStreamSet(true);

			}
		};
	  const videoError = (err)=>{
      console.log('error',err);

			if(!isRemote){
				//setLocalStreamSet(true);
			}
		}

	  return <video ref={refVideo} {...props} onClick={()=>setStart(!start)} autoPlay controls={false} />
}
