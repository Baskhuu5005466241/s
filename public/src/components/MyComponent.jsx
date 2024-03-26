import React, { useState, useEffect } from 'react';
import WebRTCExample from './WebRTCExample';
import socketIOClient from 'socket.io-client';

const MyComponent = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient('http://localhost:5000'); // Replace with your server URL
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div>
      {socket && <WebRTCExample socket={socket} />}
    </div>
  );
};

export default MyComponent;
