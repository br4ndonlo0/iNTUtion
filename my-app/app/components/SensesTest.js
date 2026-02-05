"use client";
import { useEffect, useRef, useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useVoiceInput, SG_LANGUAGES } from "../hooks/useVoiceInput";
import { getAiAction } from "../utils/aiBrain";

export default function SensesTest() {
  const [currentLang, setCurrentLang] = useState(SG_LANGUAGES.ENGLISH);
  const [lastAction, setLastAction] = useState("Waiting for input...");

  // 1. EYES
  const { videoRef, isReady, isCameraOn, toggleCamera, gestureOutput } =
    useHandTracking();

  // 2. EARS
  const { transcript, isListening, toggleListening } =
    useVoiceInput(currentLang);

  // 3. BRAIN (The "Coordinator")
  useEffect(() => {
    // We trigger the AI if:
    // A. There is text silence for 1.5s
    // B. OR... There is a gesture held for 1s (We can add this later)

    if (!transcript && !gestureOutput) return;

    const timer = setTimeout(async () => {
      // Don't send empty noise
      if (transcript.length < 2 && (!gestureOutput || gestureOutput === "None"))
        return;

      setLastAction("🧠 AI is thinking...");

      const action = await getAiAction(
        transcript,
        gestureOutput,
        "HOME_DASHBOARD",
      );

      if (action) {
        handleAiResponse(action);
      }
    }, 1500); // Wait 1.5s for the user to finish "acting"

    return () => clearTimeout(timer);
  }, [transcript, gestureOutput]); // Re-start timer if voice OR gesture changes

  const handleAiResponse = (response) => {
    // ... (Your existing handler code is perfect) ...
    if (response.action === "NAVIGATE") {
      setLastAction(`🚀 NAVIGATING to ${response.target}`);
    } else if (response.action === "FILL_FORM") {
      setLastAction(`💸 PAYING $${response.amount} to ${response.recipient}`);
    } else if (response.action === "CONFIRM") {
      setLastAction(`✅ CONFIRMED`);
    } else {
      setLastAction(`🤔 UNKNOWN ACTION`);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* --- STATUS BAR (To see what AI decided) --- */}
      <div className="fixed top-20 left-4 z-50 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur border-l-4 border-blue-600 shadow-xl p-4 rounded-r-lg max-w-xs transition-all">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            System Status
          </h3>
          <p className="text-lg font-bold text-gray-800 leading-tight">
            {lastAction}
          </p>
          {/* Debug info */}
          <div className="mt-2 text-[10px] text-gray-400 font-mono border-t pt-2">
            Voice: "{transcript.substring(0, 15)}..." <br />
            Gesture: {gestureOutput || "None"}
          </div>
        </div>
      </div>

      {/* --- LANGUAGE SWITCHER --- */}
      <div className="fixed top-4 left-40 z-50 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.ENGLISH)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${currentLang === SG_LANGUAGES.ENGLISH ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
        >
          ENG 🇸🇬
        </button>
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.CHINESE)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${currentLang === SG_LANGUAGES.CHINESE ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
        >
          中文
        </button>
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.MALAY)}
          className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm ${currentLang === SG_LANGUAGES.MALAY ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
        >
          MELAYU
        </button>
      </div>

      {/* --- VIRTUAL CURSOR (Only show if camera is ON) --- */}
      {isCameraOn && (
        <div
          id="virtual-cursor"
          className="fixed top-0 left-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-transform duration-75 z-50"
          style={{ transform: "translate(-100px, -100px)" }}
        />
      )}

      {/* --- CAMERA FEED (Top Right) --- */}
      <div className="fixed top-4 right-4 w-48 h-36 border-2 border-gray-700/50 rounded-xl overflow-hidden shadow-2xl bg-black z-40 group hover:scale-105 transition-all duration-300">
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1] opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-900/90">
            <span className="text-2xl mb-1">📷</span>
            <span className="text-[10px] font-medium tracking-wide">
              PAUSED
            </span>
          </div>
        )}
        <div
          className={`absolute bottom-2 right-2 w-2 h-2 rounded-full ${isReady && isCameraOn ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
        />
      </div>

      {/* --- VOICE TRANSCRIPT (Cinema Style) --- */}
      {transcript && (
        <div className="fixed bottom-12 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-md text-white px-8 py-4 rounded-full border border-white/10 shadow-2xl max-w-2xl text-center transform transition-all duration-300">
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
              Listening
            </p>
            <p className="text-xl md:text-2xl font-medium leading-relaxed tracking-wide">
              "{transcript}"
            </p>
          </div>
        </div>
      )}

      {/* --- MAIN CONTROLS (Top Left) --- */}
      <div className="fixed top-4 left-4 pointer-events-auto flex flex-col gap-3">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-bold shadow-lg transition-all w-36 ${
            isListening
              ? "bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-400/50"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
          }`}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />{" "}
              Mic ON
            </>
          ) : (
            <>🔇 Mic OFF</>
          )}
        </button>

        <button
          onClick={toggleCamera}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-bold shadow-lg transition-all w-36 ${
            isCameraOn
              ? "bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-400/50"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
          }`}
        >
          {isCameraOn ? <>📷 Cam ON</> : <>🚫 Cam OFF</>}
        </button>
      </div>
    </div>
  );
}
