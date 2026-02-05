"use client";
import { useState } from "react";
import { useHandTracking } from "../hooks/useHandTracking";
import { useVoiceInput, SG_LANGUAGES } from "../hooks/useVoiceInput";

export default function SensesTest() {
  const [currentLang, setCurrentLang] = useState(SG_LANGUAGES.ENGLISH);

  const { videoRef, isReady, isCameraOn, toggleCamera } = useHandTracking();

  // 4. Pass the currentLang to the hook so it actually updates!
  const { transcript, isListening, toggleListening } =
    useVoiceInput(currentLang);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Language Switcher */}
      {/* 5. ADD 'pointer-events-auto' otherwise you can't click these buttons! */}
      <div className="fixed top-4 left-40 z-50 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.ENGLISH)}
          className={`px-2 py-1 rounded text-xs transition-colors ${currentLang === SG_LANGUAGES.ENGLISH ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          ENG 🇸🇬
        </button>
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.CHINESE)}
          className={`px-2 py-1 rounded text-xs transition-colors ${currentLang === SG_LANGUAGES.CHINESE ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          中文
        </button>
        <button
          onClick={() => setCurrentLang(SG_LANGUAGES.MALAY)}
          className={`px-2 py-1 rounded text-xs transition-colors ${currentLang === SG_LANGUAGES.MALAY ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300"}`}
        >
          MELAYU
        </button>
      </div>
      {/* 1. VIRTUAL CURSOR (Red Dot) */}
      <div
        id="virtual-cursor"
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg transition-colors duration-100 z-50"
        style={{ transform: "translate(-100px, -100px)" }}
      />
      {isCameraOn && (
        <div
          id="virtual-cursor"
          className="fixed top-0 left-0 w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-lg transition-colors duration-100 z-50"
          style={{ transform: "translate(-100px, -100px)" }}
        />
      )}

      {/* 2. CAMERA FEED -> Moved to TOP RIGHT */}
      <div className="fixed top-4 right-4 w-48 h-36 border-2 border-gray-600 rounded-lg overflow-hidden shadow-2xl bg-black z-40">
        {isCameraOn ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1] opacity-80 hover:opacity-100 transition-opacity"
          />
        ) : (
          // Placeholder when Camera is OFF
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900">
            <span className="text-2xl">📷</span>
            <span className="text-xs mt-1">Camera Paused</span>
          </div>
        )}

        <div className="absolute bottom-1 right-2 text-[10px] text-gray-400 font-mono">
          {isReady && isCameraOn ? "● LIVE" : "○ OFF"}
        </div>
      </div>

      {/* 3. VOICE TRANSCRIPT -> Bottom Center (Cinema Subtitle Style) */}
      {/* Only shows if there is text */}
      {transcript && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 max-w-2xl text-center">
          <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-2xl border border-gray-700 shadow-2xl">
            <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider font-bold">
              Listening...
            </p>
            <p className="text-xl md:text-2xl font-medium leading-relaxed">
              "{transcript}"
            </p>
          </div>
        </div>
      )}

      {/* 4. CONTROLS -> Top Left (Dark Mode) */}
      <div className="fixed top-4 left-4 pointer-events-auto">
        <button
          onClick={toggleListening}
          className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all
          ${
            isListening
              ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
          }
        `}
        >
          {isListening ? (
            <>
              <span className="w-3 h-3 bg-white rounded-full animate-ping" />
              Mic ON
            </>
          ) : (
            <>
              <span className="text-xl">🔇</span>
              Mic OFF
            </>
          )}
        </button>
        <button
          onClick={toggleCamera}
          className={`
          flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-lg transition-all w-40 justify-center
          ${isCameraOn ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"}
        `}
        >
          {isCameraOn ? (
            <>
              <span>📷</span> Cam ON
            </>
          ) : (
            <>
              <span>🚫</span> Cam OFF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
