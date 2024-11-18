"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const JoinRoom = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const extractRoomId = (input) => {
    try {
      // Check if input is a URL
      if (input.includes("://") || input.includes("/room/")) {
        const url = new URL(
          input.includes("://") ? input : `http://dummy.com${input}`
        );
        const pathSegments = url.pathname.split("/");
        const roomId = pathSegments[pathSegments.indexOf("room") + 1];

        if (!roomId) throw new Error("Invalid room URL");
        return roomId;
      }

      // Treat input as direct room ID
      return input.trim();
    } catch (error) {
      throw new Error("Invalid room ID or URL format");
    }
  };

  const validateRoomId = (roomId) => {
    // Add any specific room ID validation rules here
    const isValidUUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        roomId
      );
    const isValidCustomFormat = /^[a-zA-Z0-9-_]{4,}$/.test(roomId); // At least 4 alphanumeric chars
    return isValidUUID || isValidCustomFormat;
  };

  const joinMeeting = async () => {
    try {
      setError("");
      if (!inputValue) {
        setError("Please enter a room ID or URL");
        return;
      }

      const roomId = extractRoomId(inputValue);

      if (!validateRoomId(roomId)) {
        setError("Invalid room ID format");
        return;
      }

      // Optional: Check if room exists before joining
      // const roomExists = await checkIfRoomExists(roomId);
      // if (!roomExists) {
      //   setError('Room does not exist');
      //   return;
      // }

      // Navigate to the room
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Join meeting error:", error);
      setError(error.message || "Failed to join meeting");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter room ID or meeting URL"
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={joinMeeting}
          className="bg-blue-500 text-white rounded-r-md px-4 focus:outline-none hover:bg-blue-600 transition-colors"
        >
          Join Meeting
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default JoinRoom;

// Optional: Room existence checker function
// This would need to be implemented based on your backend setup
const checkIfRoomExists = async (roomId) => {
  try {
    const response = await fetch(`/api/rooms/check/${roomId}`);
    if (!response.ok) throw new Error("Failed to check room");
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking room existence:", error);
    throw error;
  }
};
