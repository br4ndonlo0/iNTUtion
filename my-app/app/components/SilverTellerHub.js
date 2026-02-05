"use client";
import { useEffect, useRef, useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useVoiceInput, SG_LANGUAGES } from "../hooks/useVoiceInput";
import { getAiAction } from "../utils/aiBrain";

// 1. Accept 'screenName' so the AI knows context (e.g. "Transfer Page")
export default function SilverTellerHub({ screenName = "Home" }) {
  const [currentLang, setCurrentLang] = useState(SG_LANGUAGES.ENGLISH);
  const [lastAction, setLastAction] = useState("Waiting for input...");
  const cooldownRef = useRef(false);
  const holdTimerRef = useRef(null);

  // --- HOOKS ---
  const { videoRef, isReady, isCameraOn, toggleCamera, gestureOutput } =
    useHandTracking();
  const { transcript, isListening, toggleListening } =
    useVoiceInput(currentLang);

  // --- BRAIN (Slow Logic) ---
  useEffect(() => {
    if (!transcript && !gestureOutput) return;

    const timer = setTimeout(async () => {
      if (transcript.length < 2 && (!gestureOutput || gestureOutput === "None"))
        return;

      setLastAction("🧠 AI is thinking...");

      // 2. Pass the prop 'screenName' to the AI
      const action = await getAiAction(transcript, gestureOutput, screenName);

      if (action) handleAiResponse(action);
    }, 1500);

    return () => clearTimeout(timer);
  }, [transcript, gestureOutput, screenName]);

  // --- REFLEXES (Fast Logic) ---
  useEffect(() => {
    if (cooldownRef.current || !gestureOutput || gestureOutput === "None") {
      clearTimeout(holdTimerRef.current);
      return;
    }
    if (["Thumb_Up", "Thumb_Down"].includes(gestureOutput)) return;

    holdTimerRef.current = setTimeout(() => {
      performLocalAction(gestureOutput);
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
        setLastAction("Ready");
      }, 1000);
    }, 500);

    return () => clearTimeout(holdTimerRef.current);
  }, [gestureOutput]);

  // --- HELPER: READ SCREEN ---
  const readPageContent = () => {
    window.speechSynthesis.cancel();
    const elements = document.querySelectorAll(
      "h1, h2, h3, p, li, button, span",
    );
    let textToRead = "";
    elements.forEach((el) => {
      if (el.offsetParent !== null && el.innerText.trim().length > 0) {
        textToRead += el.innerText.trim() + ". ";
      }
    });
    if (!textToRead) textToRead = "The screen appears to be empty.";

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = currentLang;
    setLastAction("🗣️ READING SCREEN...");
    window.speechSynthesis.speak(utterance);
  };

  const performLocalAction = (gesture) => {
    switch (gesture) {
      case "Closed_Fist":
        setLastAction(`✊ SCROLLING...`);
        window.scrollBy({ top: 300, behavior: "smooth" });
        break;
      case "Pointing_Up":
        readPageContent();
        break;
      case "Open_Palm":
        setLastAction(`✋ STOPPING...`);
        window.speechSynthesis.cancel();
        break;
    }
  };

  const handleAiResponse = (response) => {
    // You can add router navigation here later!
    if (response.action === "NAVIGATE")
      setLastAction(`🚀 GO TO ${response.target}`);
    else if (response.action === "FILL_FORM")
      setLastAction(`💸 PAY $${response.amount}`);
    else if (response.action === "CONFIRM") setLastAction(`✅ CONFIRMED`);
    else if (response.action === "REJECT") setLastAction(`❌ REJECTED`);
    else setLastAction(`🤔 UNKNOWN`);
  };

  // --- UI RENDER (The Overlay) ---
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* 1. STATUS BAR */}
      <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur border-l-4 border-blue-600 shadow-xl p-4 rounded-r-lg max-w-xs">
          <h3 className="text-xs font-bold text-gray-500 uppercase">
            System Status
          </h3>
          <p className="text-lg font-bold text-gray-800">{lastAction}</p>
        </div>
      </div>

      {/* 2. LANGUAGE SWITCHER (Moved to left-56 to avoid overlap) */}
      <div
        className="fixed top-4 left-64 flex gap-2 z-50"
        style={{ pointerEvents: "auto" }}
      >
        {/* ENGLISH BUTTON */}
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.ENGLISH)}
          className={`px-3 py-1 rounded text-xs font-bold shadow-md hover:scale-105 transition-all ${
            currentLang === SG_LANGUAGES.ENGLISH
              ? "bg-blue-600 text-white ring-2 ring-blue-300" // Active Style
              : "bg-gray-800 text-gray-400 hover:bg-gray-700" // Inactive Style
          }`}
        >
          ENG 🇸🇬
        </button>

        {/* CHINESE BUTTON */}
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.CHINESE)}
          className={`px-3 py-1 rounded text-xs font-bold shadow-md hover:scale-105 transition-all ${
            currentLang === SG_LANGUAGES.CHINESE
              ? "bg-red-600 text-white ring-2 ring-red-300"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          中文
        </button>

        {/* MALAY BUTTON */}
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.MALAY)}
          className={`px-3 py-1 rounded text-xs font-bold shadow-md hover:scale-105 transition-all ${
            currentLang === SG_LANGUAGES.MALAY
              ? "bg-yellow-600 text-white ring-2 ring-yellow-300"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          MELAYU
        </button>
      </div>

      {/* 3. VIRTUAL CURSOR (Added pointer-events-none) */}
      {isCameraOn && (
        <div
          id="virtual-cursor"
          className="fixed top-0 left-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg z-50 pointer-events-none transition-transform duration-75"
          style={{ transform: "translate(-100px, -100px)" }}
        />
      )}

      {/* 4. CAMERA FEED */}
      <div className="fixed top-4 right-4 w-48 h-36 border-2 border-gray-700 bg-black rounded-xl overflow-hidden shadow-2xl z-40 pointer-events-auto">
        {isCameraOn && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}
      </div>

      {/* 5. CONTROLS (Added z-50 to ensure they are clickable) */}
      <div className="fixed top-4 left-4 pointer-events-auto flex flex-col gap-2 z-50">
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded-full font-bold shadow-lg w-48 transition-all hover:scale-105 ${isListening ? "bg-red-600 text-white animate-pulse" : "bg-gray-800 text-gray-300 border border-gray-600"}`}
        >
          {isListening ? "🎙️ Mic ON" : "🔇 Mic OFF"}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-full font-bold shadow-lg w-48 transition-all hover:scale-105 ${isCameraOn ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 border border-gray-600"}`}
        >
          {isCameraOn ? "📷 Cam ON" : "🚫 Cam OFF"}
        </button>
      </div>

      {/* 6. TRANSCRIPT */}
      {transcript && (
        <div className="fixed bottom-24 left-0 right-0 flex justify-center pointer-events-none z-40">
          <div className="bg-black/80 backdrop-blur text-white px-8 py-4 rounded-full text-xl border border-white/10 shadow-2xl">
            "{transcript}"
          </div>
        </div>
      )}
    </div>
  );
}
