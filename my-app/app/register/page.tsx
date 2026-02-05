'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceInput } from '@/components/VoiceInput';
import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { useVoice } from '@/context/VoiceContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { voiceState } = useVoice();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Your registration logic here
    console.log('Registering:', { username, password });
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AdaptiveCard className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <VoiceInput
              id="username"
              type="text"
              placeholder="Choose a username"
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
              placeholder="Choose a password"
              value={password}
              onChange={setPassword}
              fieldName="password"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <VoiceInput
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              fieldName="confirm"
            />
          </div>

          <AdaptiveButton
            id="register-btn"
            onClick={handleRegister}
            className="w-full mt-6"
          >
            Register
          </AdaptiveButton>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>

        {/* Voice command hint */}
        {voiceState.isListening && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              🎤 Listening for "<strong>{voiceState.targetField}</strong>" value...
            </p>
          </div>
        )}
      </AdaptiveCard>
    </div>
  );
}
