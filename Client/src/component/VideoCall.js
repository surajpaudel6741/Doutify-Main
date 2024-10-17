import React, { useEffect } from 'react';

const VideoCall = ({ roomId }) => {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/call/tenMin`);
    
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      ws.send(JSON.stringify({ roomId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message from server:', message);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  return (
    <div className="container mt-5">
      <h2>Video Call Room {roomId}</h2>
      <div id="video-call-container">
        {/* Here you can add a video call library like WebRTC, Twilio Video, or any WebRTC-based tool */}
      </div>
    </div>
  );
};

export default VideoCall;
