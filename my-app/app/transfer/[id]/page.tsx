'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VoiceInput } from '@/components/VoiceInput';
import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { useVoice } from '@/context/VoiceContext';

interface Account {
  id: string;
  name: string;
  accountNumber: string;
}

// Mock account lookup
const getAccountById = (id: string): Account | null => {
  const accounts: Record<string, Account> = {
    '1': { id: '1', name: 'John Doe', accountNumber: '1234567890' },
    '2': { id: '2', name: 'Jane Smith', accountNumber: '0987654321' },
    '3': { id: '3', name: 'Bob Johnson', accountNumber: '5555555555' },
  };
  return accounts[id] || null;
};

export default function TransferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.id as string;
  const account = getAccountById(accountId);

  const [amount, setAmount] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  
  const { voiceState, pendingFieldValue, clearPendingValue } = useVoice();

  // Handle voice amount input
  useEffect(() => {
    if (pendingFieldValue && pendingFieldValue.field === 'amount') {
      setAmount(pendingFieldValue.value);
      clearPendingValue();
    }
  }, [pendingFieldValue, clearPendingValue]);

  // Handle voice confirmation
  useEffect(() => {
    if (pendingFieldValue && pendingFieldValue.field === 'confirm_transaction') {
      handleConfirmTransfer();
      clearPendingValue();
    }
  }, [pendingFieldValue, clearPendingValue]);

  const handleConfirmTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsConfirming(true);
    
    // Simulate transfer
    setTimeout(() => {
      setIsTransferred(true);
      setIsConfirming(false);
    }, 1500);
  };

  const handleNewTransfer = () => {
    router.push('/transfer');
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AdaptiveCard>
          <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
          <AdaptiveButton onClick={() => router.push('/transfer')}>
            Back to Search
          </AdaptiveButton>
        </AdaptiveCard>
      </div>
    );
  }

  if (isTransferred) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AdaptiveCard className="w-full max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-4 text-green-600">Transfer Complete!</h1>
          <p className="text-lg mb-2">Amount: ${amount}</p>
          <p className="text-sm text-gray-600 mb-6">
            Transferred to {account.name}
          </p>
          <div className="space-y-3">
            <AdaptiveButton onClick={handleNewTransfer} className="w-full">
              New Transfer
            </AdaptiveButton>
            <AdaptiveButton onClick={() => router.push('/home')} className="w-full">
              Back to Home
            </AdaptiveButton>
          </div>
        </AdaptiveCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transfer Money</h1>

        <AdaptiveCard className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Transfer To:</h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="font-bold text-lg">{account.name}</div>
            <div className="text-sm text-gray-600">Account: {account.accountNumber}</div>
          </div>
        </AdaptiveCard>

        <AdaptiveCard id="amount-card">
          <h2 className="text-xl font-semibold mb-4">Transfer Amount</h2>
          
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (USD)
            </label>
            <VoiceInput
              id="amount"
              type="text"
              placeholder="Enter amount to transfer"
              value={amount}
              onChange={setAmount}
              fieldName="amount"
            />
          </div>

          {voiceState.isListening && voiceState.targetField === 'amount' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                🎤 Say "Transfer" then speak the amount...
              </p>
            </div>
          )}

          {amount && !isConfirming && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                💬 Say "<strong>Confirm</strong>" to complete the transfer of ${amount}
              </p>
            </div>
          )}

          <AdaptiveButton
            id="confirm-transfer-btn"
            onClick={handleConfirmTransfer}
            disabled={isConfirming || !amount}
            className="w-full"
          >
            {isConfirming ? 'Processing...' : 'Confirm Transfer'}
          </AdaptiveButton>
        </AdaptiveCard>

        <div className="mt-6">
          <AdaptiveButton onClick={() => router.back()}>
            Back
          </AdaptiveButton>
        </div>
      </div>
    </div>
  );
}
