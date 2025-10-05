import React, { useRef, useEffect } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const PoseTracker = ({ exerciseName, onScoreUpdate, onSquatTimerUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const squatStartTime = useRef(null);
  const score = useRef(0);

  const getAngle = (a, b, c) => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const cross = ab.x * cb.y - ab.y * cb.x;
    return Math.abs(Math.atan2(cross, dot) * (180 / Math.PI));
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
    });

    pose.onResults((results) => {
      const ctx = canvasRef.current.getContext("2d");
      const video = videoRef.current;

      ctx.save();
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.restore();

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 4,
        });
        drawLandmarks(ctx, results.poseLandmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });

        const leftHip = results.poseLandmarks[23];
        const leftKnee = results.poseLandmarks[25];
        const leftAnkle = results.poseLandmarks[27];
        const rightHip = results.poseLandmarks[24];
        const rightKnee = results.poseLandmarks[26];
        const rightAnkle = results.poseLandmarks[28];

        const leftKneeAngle = getAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = getAngle(rightHip, rightKnee, rightAnkle);

        // --- Good squat logic ---
        if (leftKneeAngle < 90 && rightKneeAngle < 90) {
          ctx.fillStyle = "green";
          ctx.fillText("Good Squat!", 10, 90);

          if (!squatStartTime.current) {
            squatStartTime.current = Date.now();
          } else {
            const duration = (Date.now() - squatStartTime.current) / 1000;
            onSquatTimerUpdate && onSquatTimerUpdate(duration.toFixed(1)); // live timer
            if (duration > 10) {
              score.current += 1;
              onScoreUpdate && onScoreUpdate(score.current);
              squatStartTime.current = null; // reset for next hold
            }
          }
        } else {
          ctx.fillStyle = "red";
          ctx.fillText("Bend knees more!", 10, 90);
          squatStartTime.current = null;
          onSquatTimerUpdate && onSquatTimerUpdate(0); // reset timer
        }

        // Show live score
        ctx.fillStyle = "orange";
        ctx.fillText(`Score: ${score.current}`, 10, 120);
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      onFrame: async () => await pose.send({ image: videoRef.current }),
      width: 480,
      height: 360,
    });
    cameraRef.current.start();

    return () => cameraRef.current?.stop();
  }, [onScoreUpdate, onSquatTimerUpdate]);

  return (
    <div style={{ position: "relative", width: "100%", height: "360px" }}>
      <video
        ref={videoRef}
        style={{ display: "none" }}
        width={480}
        height={360}
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        width={550}
        height={360}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default PoseTracker;
