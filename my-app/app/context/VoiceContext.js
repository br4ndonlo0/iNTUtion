// src/context/VoiceContext.tsx

function voiceReducer(state: VoiceState, action: VoiceAction): VoiceState {
  switch (action.type) {
    
    // ❌ IF YOUR CODE LOOKS LIKE THIS (STRICT), IT WILL FAIL:
    /* case 'SET_FIELD':
      if (action.field === 'amount') return { ...state, amount: action.value };
      if (action.field === 'username') return { ...state, username: action.value };
      return state; // <--- Ignores 'recipient' because it's not listed!
    */

    // ✅ CHANGE IT TO THIS (GENERIC):
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value, // This allows 'recipient', 'amount', or anything else!
      };

    // ... rest of your reducer
  }
}