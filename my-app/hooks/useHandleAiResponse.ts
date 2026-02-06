  'use client';

  import { useCallback } from 'react';
  import { useRouter } from 'next/navigation';
  import { useVoice } from '@/context/VoiceContext';

  interface AiAction {
    action: 'NAVIGATE' | 'FILL_FORM' | 'CONFIRM' | 'REJECT' | 'UNKNOWN';
    target?: string;
    amount?: number;
    recipient?: string;
    field?: string;
    value?: string;
  }

  export function useHandleAiResponse() {
    const router = useRouter();
    const { processVoiceCommand, setFieldValue } = useVoice();

    // Helper: Speak feedback to the user
  const speak = (text: string) => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

    const handleAiResponse = useCallback(async (action: AiAction) => {
      console.log('[AI RESPONSE] 📥 Received action:', action);

      try {
        switch (action.action) {
          case 'NAVIGATE':
            if (action.target) {
              console.log(`[AI RESPONSE] 🔀 NAVIGATE → /${action.target}`);
              router.push(`/${action.target}`);
            } else {
              console.log('[AI RESPONSE] ⚠️  NAVIGATE missing target');
            }
            break;
case 'FILL_FORM':
          console.log('[AI RESPONSE] 📝 FILL_FORM detected');

          // --- 1. HANDLE RECIPIENT (With Resolution) ---
          if (action.recipient) {
            console.log(`[AI RESPONSE] 🔍 Resolving recipient: ${action.recipient}`);
            let finalRecipient = action.recipient;

            try {
              // A. Get current user ID
              const authRes = await fetch('/api/auth/me');
              const authData = await authRes.json();

              if (authData.isLoggedIn) {
                // B. Call API to find "Ah Boy"
                console.log(`[AI RESPONSE] 📞 Calling /api/resolve-contact for: ${action.recipient}`);
                const res = await fetch("/api/resolve-contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    spokenName: action.recipient,
                    userId: authData.user.id,
                  }),
                });

                const data = await res.json();

                if (data.found) {
                  // ✅ Success: Use Phone Number
                  console.log(`[AI RESPONSE] ✅ Found: ${data.data.name} (${data.data.phoneNumber})`);
                  finalRecipient = data.data.phoneNumber;
                  speak(`I found your ${data.data.relationship}, ${data.data.name}.`);
                } else {
                  // ❌ Not found: Keep original text
                  console.log(`[AI RESPONSE] ❌ Contact not found.`);
                  // Optional: speak(`I couldn't find ${action.recipient}.`);
                }
              }
            } catch (err) {
              console.error("Resolution error:", err);
            }

            // Apply the recipient (either resolved phone # or original name)
            setFieldValue('recipient', finalRecipient);
          }

          // --- 2. HANDLE AMOUNT ---
          if (action.amount !== undefined) {
            console.log(`[AI RESPONSE] 💸 Setting Amount: ${action.amount}`);
            setFieldValue('amount', action.amount.toString());
          }

          // --- 3. HANDLE GENERIC FIELDS ---
          if (action.field && action.value !== undefined) {
            console.log(`[AI RESPONSE] 🔧 Setting ${action.field} = ${action.value}`);
            setFieldValue(action.field, action.value.toString());
          }
          break;

          case 'CONFIRM':
            console.log('[AI RESPONSE] ✅ CONFIRM - User confirmed action');
            // Call confirm command in VoiceContext
            processVoiceCommand('confirm');
            break;

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
