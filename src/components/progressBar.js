import React, { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client

const WebSocketProgress = ({ setLoading, toggleModal }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false);
      toggleModal("Success");
    }
  }, [progress, setLoading, toggleModal]);

  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io(process.env.REACT_APP_BACKEND_URL);

    socket.on('connect', () => {
      console.log('Socket.IO connection opened');
    });

    socket.on('job-progress', (data) => {
      setProgress(data.progress); // Update progress from server
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO connection closed');
    });

    return () => {
      socket.disconnect(); // Clean up on component unmount
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center py-4">
      <div className="flex flex-col gap-2">
        <div className="relative w-full max-w-md bg-gray-100 rounded-full h-6">
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out ${
              progress === 100 ? "bg-green-500" : "bg-orange-500"
            }`}
            style={{ width: `${progress}%` }}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center text-white font-semibold ${
                progress <= 10 ? "hidden" : ""
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>
        <div className="text-white text-sm">Importing New Records To Hubspot..</div>
      </div>
    </div>
  );
};

export default WebSocketProgress;
