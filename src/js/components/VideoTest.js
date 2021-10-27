
import React, { Component } from 'react';

class VideoTest extends Component {
	constructor(props) {
		    super(props);
		    this.state={ videoSrc: null}
		  }

	  getInitialState(){
			    return { videoSrc: null }
			  }
	  componentDidMount(){
      console.log('mount');
			if(this.state.videoSrc === null){
			    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
			    if (navigator.getUserMedia) {
						        navigator.getUserMedia({video: true}, this.handleVideo.bind(this), this.videoError);
						    }
			}
		}
	  handleVideo(stream){
      console.log('handleVideo');
			    // Update the state, triggering the component to re-render with the correct stream
     //this.setState({ videoSrc: window.URL.createObjectURL(stream) });
     this.setState({ videoSrc:stream });
			  }
	  videoError(err){
console.log('error',err);
			  }
	  render() {
			    return <div>
				      <video srcObject={()=>this.state.videoSrc} autoPlay />
				    </div>;
			    }
};


export default VideoTest;
