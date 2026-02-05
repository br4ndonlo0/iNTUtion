"use client";
import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";

export const useHandTracking = () => {
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [gestureOutput, setGestureOutput] = useState(null);

  useEffect(() => {
    // 1. If camera is off, reset and do nothing
    if (!isCameraOn) {
      setIsReady(false);
      return;
    }

    let gestureRecognizer = null;
    let animationFrameId = null;
    let stream = null;
    let isCancelled = false; // Strict Mode Safety Lock

    const setup = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        // If component unmounted while loading, stop here
        if (isCancelled) return;

        gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
            delegate: "CPU", // Keep CPU to avoid GPU crashing
          },
          runningMode: "VIDEO",
        });

        if (isCancelled) return;

        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // CRITICAL FIX: Wait for the video to actually PLAY before predicting
          videoRef.current.onloadeddata = () => {
            videoRef.current.play();
          };

          videoRef.current.onplay = () => {
            // Add a tiny delay to ensure the texture is painted
            setTimeout(() => {
              if (!isCancelled) predict();
            }, 500);
          };
        }
        setIsReady(true);
      } catch (err) {
        console.error("Camera Setup Error:", err);
        if (!isCancelled) setIsCameraOn(false);
      }
    };

    const predict = async () => {
      // 1. STOP if strict mode cancelled us
      if (isCancelled) return;

      // 2. SAFETY CHECK
      if (
        gestureRecognizer &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        !videoRef.current.paused &&
        videoRef.current.videoWidth > 0 &&
        videoRef.current.videoHeight > 0
      ) {
        try {
          const results = gestureRecognizer.recognizeForVideo(
            videoRef.current,
            Date.now(),
          );

          if (results.gestures.length > 0) {
            const name = results.gestures[0][0].categoryName;
            const score = results.gestures[0][0].score;

            // --- NEW DEBUG LOG ---
            if (score > 0.6) {
              console.log(`✅ DETECTED: ${name} (${Math.round(score * 100)}%)`);
              setGestureOutput(name);
            }
            // ---------------------
          } else {
            setGestureOutput(null);
          }
        } catch (e) {
          console.warn("Frame skipped", e);
        }
      }

      // 3. Loop only if camera is still ON
      if (isCameraOn && !isCancelled) {
        animationFrameId = requestAnimationFrame(predict);
      }
    };

    setup();

    // CLEANUP FUNCTION
    return () => {
      isCancelled = true; // Tell the async functions to stop
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (gestureRecognizer) gestureRecognizer.close();

      // Stop the camera hardware
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => setIsCameraOn((prev) => !prev);

  return { videoRef, isReady, isCameraOn, toggleCamera, gestureOutput };
};
