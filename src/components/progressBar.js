import React, { useState, useEffect } from "react";

const WebSocketProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // const ws = new WebSocket(`ws://localhost:8081`); // Connect to WebSocket server
    const ws = new WebSocket('wss://tws-automation-7d578fa3534b.herokuapp.com/');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress); // Update progress from server
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Clean up on component unmount
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
