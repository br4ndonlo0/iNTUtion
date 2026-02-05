'use client';

import React, { useState, useEffect } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { usePathname } from 'next/navigation';
import { useHandleAiResponse } from '@/hooks/useHandleAiResponse';
import { LanguageButtons } from '@/components/LanguageSelector';

export default function DebugPage() {
  const { voiceState, processVoiceCommand, processGesture, pendingFieldValue } = useVoice();
  const handleAiResponse = useHandleAiResponse();
  const [commandInput, setCommandInput] = useState('');
  const [transcriptInput, setTranscriptInput] = useState('');
  const [actionInput, setActionInput] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const pathname = usePathname();

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      const logMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      if (logMessage.includes('[VOICE]') || logMessage.includes('[GESTURE]') || logMessage.includes('[AI RESPONSE]') || logMessage.includes('[ACTION TEST]')) {
        setLogs(prev => [logMessage, ...prev].slice(0, 100)); // Keep last 100 logs
      }
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const handleTestCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (commandInput.trim()) {
      processVoiceCommand(commandInput, transcriptInput || undefined);
      setCommandInput('');
      setTranscriptInput('');
    }
  };

  const handleTestGesture = (gesture: any) => {
    processGesture(gesture);
  };

  const handleTestAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput.trim()) return;
    
    try {
      const action = JSON.parse(actionInput);
      console.log('[ACTION TEST] 🧪 Testing action:', action);
      
      // Call the actual handleAiResponse function
      handleAiResponse(action);
      
      setActionInput('');
    } catch (error) {
      console.error('[ACTION TEST] ❌ Invalid JSON:', error);
    }
  };

  const commands = ['username', 'password', 'confirm', 'search', 'navigate'];
  const gestures = ['Thumb_Up', 'Thumb_Down', 'Open_Palm', 'Closed_Fist', 'Pointing_Up', 'Victory', 'ILoveYou'];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Language Buttons */}
      <LanguageButtons />

      <h1 className="text-4xl font-bold mb-8">🎙️ Voice Command Debug Console</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Command Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current State Display */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📊 Current State</h2>
            <div className="space-y-2 text-sm font-mono">
              <p><span className="text-blue-400">mode:</span> <span className="text-green-400">{voiceState.mode}</span></p>
              <p><span className="text-blue-400">targetField:</span> <span className="text-green-400">{voiceState.targetField || 'null'}</span></p>
              <p><span className="text-blue-400">lastCommand:</span> <span className="text-green-400">{voiceState.lastCommand || 'null'}</span></p>
              <p><span className="text-blue-400">isListening:</span> <span className="text-green-400">{voiceState.isListening ? 'true' : 'false'}</span></p>
              <p><span className="text-blue-400">currentPath:</span> <span className="text-green-400">{pathname}</span></p>
              {pendingFieldValue && (
                <p><span className="text-yellow-400">⏳ Pending:</span> {pendingFieldValue.field} = "{pendingFieldValue.value}"</p>
              )}
            </div>
          </div>

          {/* Command Input */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">⌨️ Test Voice Commands</h2>
            <form onSubmit={handleTestCommand} className="space-y-3">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Enter command (e.g., 'username')"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                placeholder="Optional: transcript value (e.g., 'john123')"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
              >
                Execute Command
              </button>
            </form>

            {/* Quick Command Buttons */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Quick Commands:</p>
              <div className="grid grid-cols-2 gap-2">
                {commands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => processVoiceCommand(cmd)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Action Tester */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">🤖 Test AI Actions (JSON)</h2>
            <form onSubmit={handleTestAction} className="space-y-3">
              <input
                type="text"
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                placeholder='Enter JSON (e.g., {"action": "NAVIGATE", "target": "transfer"})'
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-semibold transition"
              >
                Test Action
              </button>
            </form>

            {/* Example Actions */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Quick Examples:</p>
              <div className="space-y-2">
                <button
                  onClick={() => setActionInput('{"action": "NAVIGATE", "target": "transfer"}')}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left transition"
                >
                  NAVIGATE → /transfer
                </button>
                <button
                  onClick={() => setActionInput('{"action": "NAVIGATE", "target": "home"}')}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left transition"
                >
                  NAVIGATE → /home
                </button>
                <button
                  onClick={() => setActionInput('{"action": "FILL_FORM", "amount": 50, "recipient": "John"}')}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left transition"
                >
                  FILL_FORM → $50 to John
                </button>
                <button
                  onClick={() => setActionInput('{"action": "CONFIRM"}')}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-left transition"
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>

          {/* Gesture Input */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">👋 Test Gestures</h2>
            <div className="grid grid-cols-2 gap-2">
              {gestures.map((gesture) => (
                <button
                  key={gesture}
                  onClick={() => handleTestGesture(gesture)}
                  className="px-3 py-2 bg-purple-700 hover:bg-purple-600 rounded text-sm transition"
                >
                  {gesture}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Logs */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-fit lg:sticky lg:top-8">
          <h2 className="text-xl font-semibold mb-4">📋 Logs</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">Logs will appear here...</p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded ${
                    log.includes('✅') ? 'bg-green-900' :
                    log.includes('❌') ? 'bg-red-900' :
                    log.includes('⚠️') ? 'bg-yellow-900' :
                    log.includes('🎯') ? 'bg-cyan-900' :
                    'bg-gray-700'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => setLogs([])}
            className="mt-4 w-full px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
          >
            Clear Logs
          </button>
        </div>
      </div>

          {/* Example Flows */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">📝 Example Test Flows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 p-4 rounded">
                <p className="font-semibold mb-2">Login Flow:</p>
                <ol className="space-y-1 text-gray-300">
                  <li>1. Navigate to /login first</li>
                  <li>2. Say "username" → then "john@example.com"</li>
                  <li>3. Say "password" → then "password123"</li>
                  <li>4. Say "confirm" → then "password123" (register only)</li>
                </ol>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="font-semibold mb-2">Transfer Flow:</p>
                <ol className="space-y-1 text-gray-300">
                  <li>1. Say "transfer" → goes to /transfer</li>
                  <li>2. Say "search" → then phone number</li>
                  <li>3. On transfer/[id] page, say "transfer"</li>
                  <li>4. Then provide amount → say "confirm"</li>
                </ol>
              </div>
              <div className="bg-gray-700 p-4 rounded">
                <p className="font-semibold mb-2">Navigate Flow:</p>
                <ol className="space-y-1 text-gray-300">
                  <li>1. Say "navigate" → system listens</li>
                  <li>2. Say target: "home", "settings", "transfer", "account", or "history"</li>
                  <li>3. Routes to the destination automatically</li>
                </ol>
              </div>
            </div>
          </div>
    </div>
  );
}
