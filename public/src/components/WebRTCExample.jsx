// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const WebRTCExample = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [callStatus, setCallStatus] = useState('');
//   const peerConnection = useRef();
//   const socket = useRef();

//   useEffect(() => {
//     // Connect to Socket.IO server
//     socket.current = io('http://localhost:5000');

//     // Get user media
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//       })
//       .catch(error => {
//         console.error('Error accessing microphone:', error);
//       });

//     // Set up event listeners for incoming offers and answers
//     socket.current.on('offer', handleOffer);
//     socket.current.on('answer', handleAnswer);

//     return () => {
//       if (localStream) {
//         localStream.getTracks().forEach(track => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//       socket.current.disconnect();
//     };
//   }, []);

//   const handleOffer = async (offer) => {
//     console.log('Offer received:', offer);

//     if (!peerConnection.current) {
//       peerConnection.current = new RTCPeerConnection();
//     }

//     try {
//       await peerConnection.current.setRemoteDescription(offer);
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       socket.current.emit('answer', answer);
//       setCallStatus('Call answered');
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   };

//   const handleAnswer = async (answer) => {
//     console.log('Answer received:', answer);
//     try {
//       await peerConnection.current.setRemoteDescription(answer);
//     } catch (error) {
//       console.error('Error handling answer:', error);
//     }
//   };

//   const startCall = async () => {
//     try {
//       if (!peerConnection.current) {
//         peerConnection.current = new RTCPeerConnection();
//       }

//       localStream.getTracks().forEach(track => {
//         peerConnection.current.addTrack(track, localStream);
//       });

//       peerConnection.current.ontrack = (event) => {
//         setRemoteStream(event.streams[0]);
//       };

//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socket.current.emit('offer', offer);
//       setCallStatus('Calling...');
//     } catch (error) {
//       console.error('Error starting call:', error);
//     }
//   };

//   const receiveCall = async () => {
//     try {
//       if (!peerConnection.current || peerConnection.current.signalingState !== 'have-remote-offer') {
//         console.error('Peer connection not in correct state to create answer');
//         return;
//       }

//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       socket.current.emit('answer', answer);
//       setCallStatus('Call answered');
//     } catch (error) {
//       console.error('Error creating answer:', error);
//     }
//   };

//   const hangUp = () => {
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//     }
//     setRemoteStream(null);
//     setCallStatus('');
//     socket.current.emit('hang-up');
//   };

//   return (
//     <div>
//       <button style={{ transform: 'scale(1.9)' }} onClick={startCall}>Start Call</button>
//       <button style={{ transform: 'scale(1.9)' }} onClick={receiveCall}>Receive Call</button>
//       <button style={{ transform: 'scale(1.9)' }} onClick={hangUp}>Hang Up</button>
//       <p style={{ position: 'absolute', top: '30px', right: '10px' }}>{callStatus}</p>
//       {remoteStream && <audio autoPlay controls srcObject={remoteStream} onError={(e) => console.error('Audio Error:', e)}></audio>}
//     </div>
//   );
// };

// export default WebRTCExample;









// import React, { useState, useEffect, useRef } from 'react';
// import io from 'socket.io-client';

// const WebRTCExample = () => {
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [callStatus, setCallStatus] = useState('');
//   const peerConnection = useRef();
//   const socket = useRef();
//   const remoteAudioRef = useRef(); // Ref for remote audio element

//   useEffect(() => {
//     // Connect to Socket.IO server
//     socket.current = io('http://localhost:5000');
  
//     // Get user media
//     navigator.mediaDevices.getUserMedia({ audio: true })
//       .then(stream => {
//         setLocalStream(stream);
//       })
//       .catch(error => {
//         console.error('Error accessing microphone:', error);
//       });

//     // Set up event listener for incoming offers
//     socket.current.on('offer', async (offer) => {
//       console.log('Offer received:', offer);
      
//       // Set the remote description
//       await peerConnection.current.setRemoteDescription(offer);
    
//       // Create an answer
//       const answer = await peerConnection.current.createAnswer();
    
//       // Set local description with the answer
//       await peerConnection.current.setLocalDescription(answer);
    
//       // Send the answer back to the server
//       socket.current.emit('answer', answer);
      
//       // Update call status
//       setCallStatus('Call answered');
//     });
  
//     socket.current.on('answer', (answer) => {
//     console.log('Answer received from server:', answer);
//     // Assuming you have a peerConnection object set up
//     // Set the remote description with the received answer
//     peerConnection.current.setRemoteDescription(answer);
//   });

//   // Set remote stream when tracks are received
//   if (peerConnection.current) {
//     peerConnection.current.ontrack = (event) => {
//       setRemoteStream(event.streams[0]);
//       if (remoteAudioRef.current) {
//         remoteAudioRef.current.srcObject = event.streams[0];
//       }
//     };
//   }

//     return () => {
//       if (localStream) {
//         localStream.getTracks().forEach(track => track.stop());
//       }
//       if (peerConnection.current) {
//         peerConnection.current.close();
//       }
//       socket.current.disconnect();
//     };
//   }, []);

//   const startCall = async () => {
//     try {
//       // Create RTCPeerConnection
//       peerConnection.current = new RTCPeerConnection();
  
//       // Add local stream tracks to RTCPeerConnection
//       localStream.getTracks().forEach(track => {
//         peerConnection.current.addTrack(track, localStream);
//       });
  
//       // Create offer
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
  
//       // Send offer to backend via Socket.IO
//       socket.current.emit('offer', peerConnection.current.localDescription);
  
//       setCallStatus('Calling...');
//     } catch (error) {
//       console.error('Error starting call:', error);
//     }
//   };
  
//   const receiveCall = async () => {
//     try {
//       // Check if peerConnection.current exists and is in the correct state
//       if (!peerConnection.current || peerConnection.current.signalingState !== 'have-remote-offer') {
//         console.error('Peer connection not in correct state to create answer');
//         return;
//       }
  
//       // Create answer
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
  
//       // Send answer to caller
//       socket.current.emit('answer', answer);
  
//       // Update call status
//       setCallStatus('Call answered');
//     } catch (error) {
//       console.error('Error creating answer:', error);
//     }
//   };
  

//   const hangUp = () => {
//     if (localStream) {
//       localStream.getTracks().forEach(track => track.stop());
//     }
//     setRemoteStream(null);
//     setCallStatus('');
//     socket.current.emit('hang-up');
//   };

//   return (
//     <div>
//       <button style={{ transform: 'scale(1.9)' }} onClick={startCall}>Start Call</button>
//       <button style={{ transform: 'scale(1.9)' }} onClick={receiveCall}>Receive Call</button>
//       <button style={{ transform: 'scale(1.9)' }} onClick={hangUp}>Hang Up</button>
//       <p style={{ position: 'absolute', top: '30px', right: '10px' }}>{callStatus}</p>
//       <audio autoPlay controls ref={remoteAudioRef}></audio>
//     </div>
//   );
// };

// export default WebRTCExample;

















import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const WebRTCExample = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState('');
  const peerConnection = useRef();
  const socket = useRef();
  const remoteAudioRef = useRef(); // Ref for remote audio element

  useEffect(() => {
    // Connect to Socket.IO server
    socket.current = io('http://localhost:5000');

    // Get user media
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setLocalStream(stream);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
      });

    // Set up event listener for incoming offers
    socket.current.on('offer', async (offer) => {
      console.log('Offer received:', offer);
      
      // Set the remote description
      await peerConnection.current.setRemoteDescription(offer);
    
      // Create an answer
      const answer = await peerConnection.current.createAnswer();
    
      // Set local description with the answer
      await peerConnection.current.setLocalDescription(answer);
    
      // Send the answer back to the server
      socket.current.emit('answer', answer);
      
      // Update call status to "answered"
      setCallStatus('Answered');
    });
  
    socket.current.on('answer', (answer) => {
      console.log('Answer received from server:', answer);
      // Assuming you have a peerConnection object set up
      // Set the remote description with the received answer
      peerConnection.current.setRemoteDescription(answer);
      
      // Update call status to "answered"
      setCallStatus('Answered');
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      socket.current.disconnect();
    };
  }, []);

  const startCall = async () => {
    try {
      // Create RTCPeerConnection
      peerConnection.current = new RTCPeerConnection();
  
      // Add local stream tracks to RTCPeerConnection
      localStream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, localStream);
      });
  
      // Create offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
  
      // Send offer to backend via Socket.IO
      socket.current.emit('offer', peerConnection.current.localDescription);
  
      setCallStatus('Calling...');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };
  
  const receiveCall = async () => {
    try {
      // Check if peerConnection.current exists and is in the correct state
      if (!peerConnection.current || peerConnection.current.signalingState !== 'have-remote-offer') {
        console.error('Peer connection not in correct state to create answer');
        return;
      }
  
      // Create answer
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
  
      // Send answer to caller
      socket.current.emit('answer', answer);
  
      // Update call status
      setCallStatus('Call answered');
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const hangUp = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setRemoteStream(null);
    setCallStatus('');
    socket.current.emit('hang-up');
  };

  return (
    <div>
      <button style={{ transform: 'scale(1.9)' }} onClick={startCall}>Start Call</button>
      <button style={{ transform: 'scale(1.9)' }} onClick={receiveCall}>Receive Call</button>
      <button style={{ transform: 'scale(1.9)' }} onClick={hangUp}>Hang Up</button>
      <p style={{ position: 'absolute', top: '30px', right: '10px' }}>{callStatus}</p>
      <audio autoPlay controls ref={remoteAudioRef}></audio>
    </div>
  );
};

export default WebRTCExample;
