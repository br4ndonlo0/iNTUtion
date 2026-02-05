'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceInput } from '@/components/VoiceInput';
import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { useVoice } from '@/context/VoiceContext';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
  phoneNumber: string;
}

// Mock accounts for demo
const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'John Doe', accountNumber: '1234567890', phoneNumber: '+1234567890' },
  { id: '2', name: 'Jane Smith', accountNumber: '0987654321', phoneNumber: '+0987654321' },
  { id: '3', name: 'Bob Johnson', accountNumber: '5555555555', phoneNumber: '+5555555555' },
];

export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const router = useRouter();
  const { voiceState, pendingFieldValue, clearPendingValue } = useVoice();

  // Handle voice search input
  useEffect(() => {
    if (pendingFieldValue && pendingFieldValue.field === 'search') {
      const query = pendingFieldValue.value;
      setSearchQuery(query);
      handleSearch(query);
      clearPendingValue();
    }
  }, [pendingFieldValue, clearPendingValue]);

  const handleSearch = (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    // Search in account numbers and phone numbers
    const results = MOCK_ACCOUNTS.filter(
      (account) =>
        account.accountNumber.includes(query) ||
        account.phoneNumber.includes(query) ||
        account.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);

    // Auto-select if only one match
    if (results.length === 1) {
      setSelectedAccount(results[0]);
      setTimeout(() => {
        router.push(`/transfer/${results[0].id}`);
      }, 500);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    router.push(`/transfer/${account.id}`);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transfer Money</h1>

        <AdaptiveCard>
          <h2 className="text-xl font-semibold mb-4">Search for Account</h2>
          
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium mb-2">
              Account Number or Phone Number
            </label>
            <VoiceInput
              id="search"
              type="text"
              placeholder="Enter account or phone number"
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                handleSearch(value);
              }}
              fieldName="search"
            />
          </div>

          {voiceState.isListening && voiceState.targetField === 'search' && (
            <div className="p-3 bg-green-50 border border-green-200 rounded mb-4">
              <p className="text-sm text-green-800">
                🎤 Listening for account number or phone number...
              </p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Search Results:</h3>
              {searchResults.map((account) => (
                <div
                  key={account.id}
                  onClick={() => handleSelectAccount(account)}
                  className="p-4 border-2 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="font-semibold">{account.name}</div>
                  <div className="text-sm text-gray-600">Account: {account.accountNumber}</div>
                  <div className="text-sm text-gray-600">Phone: {account.phoneNumber}</div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                No accounts found matching "{searchQuery}"
              </p>
            </div>
          )}
        </AdaptiveCard>

        <div className="mt-6">
          <AdaptiveButton onClick={() => router.push('/home')}>
            Back to Home
          </AdaptiveButton>
        </div>
      </div>
    </div>
  );
}
