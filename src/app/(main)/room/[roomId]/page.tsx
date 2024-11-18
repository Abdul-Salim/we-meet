"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";

const Room = () => {
  const router = useRouter();
  const { roomId } = useParams();
  const socket = useSocket();
  const { myId, peer } = usePeer();
  const [stream, setStream] = useState(null);
  const [participants, setParticipants] = useState(new Set());
  const [remoteStreams, setRemoteStreams] = useState({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({}); // Store peer connections

  // Initialize media stream
  useEffect(() => {
    const startMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(userStream);
        streamRef.current = userStream;

        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (error) {
        console.error("Media access error:", error);
        alert(`Media access error: ${error.message}`);
      }
    };

    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      // Cleanup peer connections
      Object.values(peersRef.current).forEach((call) => call.close());
    };
  }, []);

  // Handle room connection and peer events
  useEffect(() => {
    if (!socket || !peer || !roomId || !stream) return;

    // Join room
    socket.emit("join-room", { roomId, userId: myId });

    // Handle existing participants
    socket.on("get-users", (users) => {
      users.forEach((userId) => {
        if (userId !== myId) {
          setParticipants((prev) => new Set(prev).add(userId));
          callUser(userId);
        }
      });
    });

    // Handle new user joining
    socket.on("user-joined", ({ userId }) => {
      console.log("User joined:", userId);
      setParticipants((prev) => new Set(prev).add(userId));
    });

    // Handle incoming calls
    peer.on("call", handleIncomingCall);

    // Handle user leaving
    socket.on("user-left", ({ userId }) => {
      setParticipants((prev) => {
        const newParticipants = new Set(prev);
        newParticipants.delete(userId);
        return newParticipants;
      });

      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });

      // Close and cleanup peer connection
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
      }
    });

    return () => {
      socket.emit("leave-room", { roomId, userId: myId });
      socket.off("get-users");
      socket.off("user-joined");
      socket.off("user-left");
      peer.off("call");

      // Cleanup all peer connections
      Object.values(peersRef.current).forEach((call) => call.close());
      peersRef.current = {};
    };
  }, [socket, peer, roomId, stream, myId]);

  // Handle incoming calls
  const handleIncomingCall = (call) => {
    call.answer(stream);

    call.on("stream", (remoteStream) => {
      const remoteUserId = call.peer;
      setRemoteStreams((prev) => ({
        ...prev,
        [remoteUserId]: remoteStream,
      }));
    });

    call.on("close", () => {
      const remoteUserId = call.peer;
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[remoteUserId];
        return newStreams;
      });
    });

    peersRef.current[call.peer] = call;
  };

  // Call a user
  const callUser = (userId) => {
    const call = peer.call(userId, stream);

    call.on("stream", (remoteStream) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [userId]: remoteStream,
      }));
    });

    call.on("close", () => {
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
    });

    peersRef.current[userId] = call;
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Leave room
  const leaveRoom = () => {
    if (socket) {
      socket.emit("leave-room", { roomId, userId: myId });
    }
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    // Close all peer connections
    Object.values(peersRef.current).forEach((call) => call.close());
    router.push("/dashboard"); // or wherever you want to redirect
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Room: {roomId}</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleAudio}
            className={`px-4 py-2 rounded ${
              isAudioEnabled ? "bg-blue-500" : "bg-red-500"
            } text-white`}
          >
            {isAudioEnabled ? "Mute" : "Unmute"}
          </button>
          <button
            onClick={toggleVideo}
            className={`px-4 py-2 rounded ${
              isVideoEnabled ? "bg-blue-500" : "bg-red-500"
            } text-white`}
          >
            {isVideoEnabled ? "Stop Video" : "Start Video"}
          </button>
          <button
            onClick={leaveRoom}
            className="px-4 py-2 rounded bg-red-500 text-white"
          >
            Leave
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Local video */}
        <div className="video-container">
          <h2 className="text-xl mb-2">Your Video (ID: {myId})</h2>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md h-[300px] border rounded bg-gray-200 object-cover"
          />
        </div>

        {/* Remote videos */}
        {Object.entries(remoteStreams).map(([userId, remoteStream]) => (
          <div key={userId} className="video-container">
            <h2 className="text-xl mb-2">Remote User: {userId}</h2>
            <video
              autoPlay
              playsInline
              className="w-full max-w-md h-[300px] border rounded bg-gray-200 object-cover"
              ref={(el) => {
                if (el) el.srcObject = remoteStream;
              }}
            />
          </div>
        ))}
      </div>

      {/* Participants list */}
      <div className="mt-4">
        <h2 className="text-xl mb-2">Participants ({participants.size + 1})</h2>
        <ul className="list-disc pl-5">
          <li>You (ID: {myId})</li>
          {Array.from(participants).map((userId) => (
            <li key={userId}>User ID: {userId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Room;
