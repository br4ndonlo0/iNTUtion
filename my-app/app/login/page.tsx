'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceInput } from '@/components/VoiceInput';
import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { useVoice } from '@/context/VoiceContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { voiceState } = useVoice();

  const handleLogin = () => {
    // Your login logic here
    console.log('Logging in:', { username, password });
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AdaptiveCard className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <VoiceInput
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={setUsername}
              fieldName="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <VoiceInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              fieldName="password"
            />
          </div>

          <AdaptiveButton
            id="login-btn"
            onClick={handleLogin}
            className="w-full mt-6"
          >
            Login
          </AdaptiveButton>

          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>

        {/* Voice command hint */}
        {voiceState.isListening && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              🎤 Say "<strong>{voiceState.targetField}</strong>" and then speak the value
            </p>
          </div>
        )}
      </AdaptiveCard>
    </div>
  );
}
