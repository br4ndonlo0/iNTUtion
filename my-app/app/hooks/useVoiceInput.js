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
  // OPTIMISTIC UI: We trust the user wants it on until proven otherwise
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);

  // 1. Sync Ref
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("❌ Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = languageCode;

    // We don't rely on 'onstart' to change UI anymore.
    // We only use it for logging.
    recognition.onstart = () => {
      console.log(`🎤 Hardware Active: ${languageCode}`);
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0].transcript;
      setTranscript(lastResult);
      console.log("🗣️ Heard:", lastResult);
    };

    recognition.onerror = (event) => {
      // Ignore minor errors
      if (event.error === "no-speech" || event.error === "aborted") return;

      console.error("⚠️ Speech Error:", event.error);
      // ONLY turn off if it's a hard failure
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setIsListening(false);
        alert("Microphone blocked. Please enable permissions.");
      }
    };

    recognition.onend = () => {
      // If the browser kills the mic but we wanted it open, we update state
      if (isListeningRef.current) {
        console.log("🛑 Browser stopped session.");
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    // --- AUTO-RESTART (For Language Switching) ---
    // If we were listening before the switch, restart immediately
    if (isListeningRef.current) {
      const timer = setTimeout(() => {
        if (isListeningRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.start();
            console.log(`🎤 Switched to ${languageCode}`);
          } catch (e) {
            console.warn("Restart overlap", e);
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }

    return () => {
      if (recognition) {
        // Silently kill the old mic so it doesn't trigger 'onend'
        recognition.onend = null;
        recognition.stop();
      }
    };
  }, [languageCode]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      // STOPPING
      setIsListening(false); // Turn Grey Immediately
      recognitionRef.current.stop();
    } else {
      // STARTING
      setIsListening(true); // Turn Blue Immediately (Optimistic)
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("❌ Start Failed:", error);
        setIsListening(false); // Revert if it actually crashed
      }
    }
  };

  return { transcript, isListening, toggleListening };
};
