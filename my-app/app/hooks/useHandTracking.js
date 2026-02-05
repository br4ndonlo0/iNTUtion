"use client";
import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

export const useHandTracking = () => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // We use refs for data that changes 60fps to avoid React re-renders
  const cursorRef = useRef({ x: 0, y: 0 });
  const isPinchingRef = useRef(false);

  useEffect(() => {
    if (!isCameraOn) {
      setIsReady(false);
      return;
    }

    let gestureRecognizer = null;
    let animationFrameId = null;
    let stream = null;

    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
        });

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predict);
        }
        setIsReady(true);
      } catch (err) {
        console.error("Camera Setup Error:", err);
        setIsCameraOn(false); // Turn off switch if camera fails
      }
    };

    const predict = async () => {
      // 1. SAFETY CHECK: Ensure model and video are ready
      if (
        gestureRecognizer &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        // 2. GENERATE RESULTS (This line was missing!)
        const results = gestureRecognizer.recognizeForVideo(
          videoRef.current,
          Date.now(),
        );

        if (results.gestures.length > 0) {
          const categoryName = results.gestures[0][0].categoryName;
          const score = results.gestures[0][0].score;

          // Only log high-confidence gestures to reduce spam
          if (score > 0.5) {
            console.log(`Gesture: ${categoryName}, Score: ${score.toFixed(2)}`);
          }
        }
      }

      // 3. Loop
      animationFrameId = requestAnimationFrame(predict);
    };

    setup();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (gestureRecognizer) gestureRecognizer.close();
    };
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [isCameraOn]);
  const toggleCamera = () => setIsCameraOn((prev) => !prev);

  return { videoRef, isReady, isCameraOn, toggleCamera };
};
