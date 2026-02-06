'use client';

  import { useCallback } from 'react';
  import { useRouter } from 'next/navigation';
  import { useVoice } from '@/context/VoiceContext';
import { set } from 'mongoose';

interface AiAction {
  action: 'NAVIGATE' | '导航' | 'mengemudi' | 'FILL_FORM' | 'CONFIRM' | 'REJECT' | 'UNKNOWN' | 'isi_borang' | '填表' | 'setuju' | '确认' | 'tolak' | '拒绝' | 'NAME' | '名字' | 'nama' | 'USERNAME' | '用户名' | 'nama_pengguna' | 'PASSWORD' | '密码' | 'kata_laluan' | 'CONFIRM_PASSWORD' | '确认密码' | 'sahkan_kata_laluan' | 'PHONE' | '电话' | 'telefon' | 'EMAIL' | '电子邮件' | 'emel' | 'AGREE' | 'LOGIN' | 'REGISTER';
  target?: string;
  amount?: number;
  recipient?: string;
  field?: string;
  value?: string;
}

interface AiHandlers {
  onRegister?: () => void;
  onLogin?: () => void;
  onAgree?: () => void;
}

export function useHandleAiResponse({ onRegister, onLogin, onAgree }: AiHandlers = {}) {
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
        case 'REGISTER':
          if (typeof onRegister === 'function') {
            speak('Registering your account now.');
            onRegister();
          } else {
            console.log('[AI RESPONSE] REGISTER action received, but no handler provided.');
          }
          break;
        case 'LOGIN':
          if (typeof onLogin === 'function') {
            speak('Logging you in now.');
            onLogin();
          } else {
            console.log('[AI RESPONSE] LOGIN action received, but no handler provided.');
          }
          break;
        case 'AGREE':
          if (typeof onAgree === 'function') {
            speak('You have agreed to the terms.');
            onAgree();
          } else {
            console.log('[AI RESPONSE] AGREE action received, but no handler provided.');
          }
          break;
        case 'NAME':
        case '名字':
        case 'nama':
          // Set the full name field directly
          if (action.value) {
            setFieldValue('name', action.value);
            speak(`Full name set to ${action.value}`);
          }
          break;
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
          if (action.amount !== undefined && action.recipient !== undefined) {
            setFieldValue('phoneNumber', action.recipient.toString());
            console.log(`[AI RESPONSE] 💸 Setting Amount: ${action.amount}`);
            setFieldValue('amount', action.amount.toString());
          }

          // --- 3. HANDLE GENERIC FIELDS ---
          if (action.field && action.value !== undefined) {
            let cleanValue = action.value.toString();
            // For username, email, phone, password, allow only letters, numbers, and !@#$%^&*()_+{}[]\|
            if (["username", "email", "phone", "phoneNumber", "password", "confirmPassword"].includes(action.field)) {
              cleanValue = cleanValue.replace(/[^a-zA-Z0-9!@#$%^&*()_+{}\[\]\\|]/g, "");
            }
            // For name/full name, keep single spaces between words and only allow letters and spaces
            if (["name", "fullName", "full_name"].includes(action.field)) {
              cleanValue = cleanValue.replace(/[^a-zA-Z\s]/g, "").replace(/\s+/g, " ").trim();
            }
            console.log(`[AI RESPONSE] 🔧 Setting ${action.field} = ${cleanValue}`);
            setFieldValue(action.field, cleanValue);
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
  }, [router, processVoiceCommand, setFieldValue, onRegister, onLogin, onAgree]);

  return handleAiResponse;
}
