import React, { useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const VideoRoom = () => {
  const roomID = "your-room-id"; // You can generate this dynamically
  let myMeeting = async (element) => {
    // Generate Kit Token
    const appID =2084011485;  // Type: Number
    const serverSecret = "dbe3bb4c0860c83b0a7475b6b132b187"; // Type: String
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      Date.now().toString(),  // Generate a unique user ID
      "User Name"  // User name displayed in the room
    );

    // Create instance object from Kit Token
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [{
        name: 'Personal link',
        url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomID,
      }],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls
        // mode: ZegoUIKitPrebuilt.GroupCall, // To implement group calls
      },
      showScreenSharingButton: true,
      showPreJoinView: true, // Show a pre-join view where users can check their devices before joining
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      onLeaveRoom: () => {
        // Handle after user leaves the room
        console.log("User has left the room");
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    >
    </div>
  );
};

export default VideoRoom;