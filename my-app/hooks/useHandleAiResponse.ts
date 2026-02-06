'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useVoice } from '@/context/VoiceContext';

interface AiAction {
  action: 'NAVIGATE' | '导航' | 'mengemudi' | 'FILL_FORM' | 'CONFIRM' | 'REJECT' | 'UNKNOWN' | 'isi_borang' | '填表' | 'setuju' | '确认' | 'tolak' | '拒绝' | 'FULL_NAME' | '全名' | 'nama_penuh' | 'USERNAME' | '用户名' | 'nama_pengguna' | 'PASSWORD' | '密码' | 'kata_laluan' | 'CONFIRM_PASSWORD' | '确认密码' | 'sahkan_kata_laluan' | 'PHONE' | '电话' | 'telefon' | 'EMAIL' | '电子邮件' | 'emel';
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

        case 'FULL_NAME':
        case '全名':
        case 'nama_penuh':
          console.log('[AI RESPONSE] 👤 FULL_NAME - Listening for full name input');
          processVoiceCommand('name');
          break;

        case 'USERNAME':
        case '用户名':
        case 'nama_pengguna':
          console.log('[AI RESPONSE] 👤 USERNAME - Listening for username input');
          processVoiceCommand('username');
          break;

        case 'PASSWORD':
        case '密码':
        case 'kata_laluan':
          console.log('[AI RESPONSE] 🔒 PASSWORD - Listening for password input');
          processVoiceCommand('password');
          break;

        case 'CONFIRM_PASSWORD':
        case '确认密码':
        case 'sahkan_kata_laluan':
          console.log('[AI RESPONSE] ✅ CONFIRM_PASSWORD - Listening for confirm password input');
          processVoiceCommand('confirm');
          break;

        case 'PHONE':
        case '电话':
        case 'telefon':
          console.log('[AI RESPONSE] 📱 PHONE - Listening for phone number input');
          processVoiceCommand('phone');
          break;

        case 'EMAIL':
        case '电子邮件':
        case 'emel':
          console.log('[AI RESPONSE] 📧 EMAIL - Listening for email input');
          processVoiceCommand('email');
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
