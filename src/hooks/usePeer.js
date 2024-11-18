"use client";

import { Peer } from "peerjs";
import { useState, useEffect, useRef } from "react";

const usePeer = () => {
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current) return;
    isPeerSet.current = true;

    const newPeer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
        ],
      },
    });

    newPeer.on("open", (id) => {
      console.log("My peer ID is:", id);
      setMyId(id);
    });

    newPeer.on("error", (error) => {
      console.error("PeerJS error:", error);
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
    };
  }, []);

  return { myId, peer };
};

export default usePeer;
