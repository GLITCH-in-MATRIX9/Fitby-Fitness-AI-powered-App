import React, { useState, useEffect } from "react";

const VideoTools = ({ videoId }) => {
  const [timerStarted, setTimerStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval;
    if (timerStarted) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerStarted]);

  const handleStart = () => setTimerStarted(true);
  const handleStop = () => setTimerStarted(false);
  const handleReset = () => {
    setTimerStarted(false);
    setSeconds(0);
  };

  const buttonBase =
    "px-4 py-2 rounded border border-[#e9632e] text-[#e9632e] font-semibold transition duration-200 hover:bg-black hover:text-white";

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-md text-center space-y-6">
      {/* Timer */}
      <div>
        <p className="text-gray-700 text-lg">⏱ Timer: {seconds}s</p>
        <div className="flex justify-center flex-wrap gap-3 mt-3">
          <button
            onClick={handleStart}
            disabled={timerStarted}
            className={`${buttonBase} ${timerStarted && "opacity-50 cursor-not-allowed bg-[#e9632e] text-black"}`}
          >
            ▶ Start
          </button>
          <button
            onClick={handleStop}
            disabled={!timerStarted}
            className={`${buttonBase} ${!timerStarted && "opacity-50 cursor-not-allowed"}`}
          >
            ⏸ Stop
          </button>
          <button onClick={handleReset} className={buttonBase}>
            🔄 Reset
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default VideoTools;
