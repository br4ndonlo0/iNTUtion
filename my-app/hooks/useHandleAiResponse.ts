'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useVoice } from '@/context/VoiceContext';

interface AiAction {
  action: 'NAVIGATE' | '导航' | 'mengemudi' | 'FILL_FORM' | 'CONFIRM' | 'REJECT' | 'UNKNOWN' | 'isi_borang' | '填表' | 'setuju' | '确认' | 'tolak' | '拒绝';
  target?: string;
  amount?: number;
  recipient?: string;
  field?: string;
  value?: string;
}

export function useHandleAiResponse() {
  const router = useRouter();
  const { processVoiceCommand, setFieldValue } = useVoice();

  const handleAiResponse = useCallback((action: AiAction) => {
    console.log('[AI RESPONSE] 📥 Received action:', action);

    try {
      switch (action.action) {
        case 'NAVIGATE':
        case '导航':
        case 'mengemudi':
          if (action.target) {
            console.log(`[AI RESPONSE] 🔀 NAVIGATE → /${action.target}`);
            router.push(`/${action.target}`);
          } else {
            console.log('[AI RESPONSE] ⚠️  NAVIGATE missing target');
          }
          break;
        case '填表':
        case 'isi_borang':

        case 'FILL_FORM':
          console.log('[AI RESPONSE] 📝 FILL_FORM detected');
          if (action.amount !== undefined && action.recipient) {
            console.log(`[AI RESPONSE] 💸 Amount: ${action.amount}, Recipient: ${action.recipient}`);
            // Set the amount field
            setFieldValue('amount', action.amount.toString());
            // Set the recipient field
            setFieldValue('recipient', action.recipient);
            console.log('[AI RESPONSE] ✅ Form fields set - amount and recipient');
          } else if (action.field && action.value !== undefined) {
            // Generic field setter
            console.log(`[AI RESPONSE] ✅ Setting ${action.field} = ${action.value}`);
            setFieldValue(action.field, action.value.toString());
          } else {
            console.log('[AI RESPONSE] ⚠️  FILL_FORM missing required fields (amount + recipient OR field + value)');
          }
          break;
        case '确认':
        case 'setuju':

        case 'CONFIRM':
          console.log('[AI RESPONSE] ✅ CONFIRM - User confirmed action');
          // Call confirm command in VoiceContext
          processVoiceCommand('confirm');
          break;
        case '拒绝':
        case 'tolak':

        case 'REJECT':
          console.log('[AI RESPONSE] ❌ REJECT - User rejected action');
          // Could add a reject command if needed
          break;

        case 'UNKNOWN':
          console.log('[AI RESPONSE] ❓ UNKNOWN action - could not determine intent');
          break;

        default:
          console.log('[AI RESPONSE] ⚠️  Unhandled action type:', (action as any).action);
      }
    } catch (error) {
      console.error('[AI RESPONSE] ❌ Error handling action:', error);
    }
  }, [router, processVoiceCommand, setFieldValue]);

  return handleAiResponse;
}
