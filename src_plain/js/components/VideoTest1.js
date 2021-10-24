import { useState, useEffect, useRef } from 'react'


export default function VideoTest({ ...props }) {
  const [start, setStart] = useState(false);
  const [sObject, setSObject] = useState(false);
  const [sObjectA, setSObjectA] = useState(false);
	  const refVideo = useRef(null)

	  useEffect(() => {
			if(!start) return
console.log('effect',refVideo ,refVideo.current );
			    if (!refVideo.current) return
			    refVideo.current.srcObject = sObject;
			    refVideo.current.A = "OK";
console.log('effect set',refVideo);
			  }, [sObjectA])

	  useEffect(() => {
			if(!start) return
      console.log('mount');
			    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
			    if (navigator.getUserMedia) {
						        navigator.getUserMedia({video: true}, handleVideo, videoError);
						    }
		}, [start])
	const handleVideo = (stream)=>{
			if(!start) return
      console.log('handleVideo');
			    // Update the state, triggering the component to re-render with the correct stream
     setSObject(stream);
     setSObjectA(true);
			  }
	  const videoError = (err)=>{
console.log('error',err);
			  }

	  return <video ref={refVideo} {...props} onClick={()=>setStart(true)} autoPlay />
}
