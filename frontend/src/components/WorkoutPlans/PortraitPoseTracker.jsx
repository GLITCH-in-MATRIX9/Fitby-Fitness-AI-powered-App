import React from "react";
import PoseTracker from "./PoseTracker";

const PortraitPoseTracker = ({ active, exerciseName }) => {
  return (
    <div className="w-full max-w-[360px] lg:ml-6 flex-shrink-0">
      <h2 className="text-xl font-bold mb-2 text-center">Posture Tracker</h2>
      {active ? (
        <div className="w-full aspect-[9/16] mx-auto border rounded-xl overflow-hidden shadow-lg">
          <PoseTracker exerciseName={exerciseName} />
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          Posture Tracker will activate after completing the video.
        </p>
      )}
    </div>
  );
};

export default PortraitPoseTracker;
