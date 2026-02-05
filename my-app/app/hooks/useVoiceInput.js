"use client";
import { useState, useEffect, useRef } from "react";

// 🇸🇬 Singapore Language Constants
export const SG_LANGUAGES = {
  ENGLISH: "en-SG", // Singlish friendly
  CHINESE: "zh-SG", // Singaporean Mandarin
  MALAY: "ms-MY", // Standard Malay
  TAMIL: "ta-SG", // Singaporean Tamil
};

export const useVoiceInput = (languageCode = SG_LANGUAGES.ENGLISH) => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // We use a Ref to track "intent" to listen.
  // This prevents "stale closure" bugs inside the 'onend' event.
  const isListeningRef = useRef(isListening);

  useEffect(() => {
    // Sync the ref with the state whenever it changes
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // 1. CLEANUP OLD INSTANCE
      // If a mic is already running, kill it before making a new one
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Remove listeners to prevent "restart" loops
        recognitionRef.current.stop();
      }

      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = languageCode; // <--- Updates when you switch props

      recognition.onresult = (event) => {
        const lastResult =
          event.results[event.results.length - 1][0].transcript;
        setTranscript(lastResult);
        console.log("Voice Command:", lastResult);
      };

      recognition.onerror = (event) => {
        console.error("Speech Error:", event.error);
      };

      recognition.onend = () => {
        // Auto-restart ONLY if we are supposed to be listening
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            console.log("Restart prevented (busy)");
          }
        }
      };

      recognitionRef.current = recognition;

      // 3. SAFE START (The Magic Fix)
      // We wait 100ms to let the old mic fully die before starting the new one
      if (isListeningRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log(`Mic switched to ${languageCode}`);
          } catch (error) {
            console.error("Mic switch error:", error);
          }
        }, 100);
      }

      // Clean up: Stop listening if the component unmounts or language changes
      return () => {
        recognition.stop();
      };
    }
  }, [languageCode]); // <--- Re-run this effect only if Language changes

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error("Failed to start voice recognition:", error);
      }
    }
  };

  return { transcript, isListening, toggleListening };
};
