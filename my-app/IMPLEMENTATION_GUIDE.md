# AI-Powered Accessibility Interface - Implementation Guide

## 🎯 What This System Does

This is an AI-driven accessibility system where:
1. User makes a request (voice/camera gesture/text) → "I need high contrast"
2. Backend sends request to Gemini AI
3. AI returns JSON with accessibility settings
4. Frontend instantly applies CSS changes
5. UI transforms: colors, fonts, layout, highlights

## 📁 Project Structure

```
my-app/
├── types/
│   └── accessibility.ts          # TypeScript interfaces for AI JSON
├── context/
│   └── StyleContext.tsx          # React Context for state management
├── components/
│   ├── StyleApplier.tsx          # Injects CSS variables into DOM
│   ├── AdaptiveButton.tsx        # Button that reads CSS variables
│   ├── AdaptiveCard.tsx          # Card that can be highlighted
│   └── AdaptiveImage.tsx         # Image that can be hidden
├── app/
│   ├── layout.tsx                # Wraps app with StyleProvider
│   ├── globals.css               # Mode-specific CSS (.high_contrast, etc)
│   ├── demo/
│   │   └── page.tsx              # Cluttered demo page
│   └── api/
│       └── analyze/
│           └── route.ts          # Backend: Gemini API integration
└── .env.local                    # GEMINI_API_KEY
```

## 🔧 Setup Steps

### Step 1: Install Dependencies
```bash
cd my-app
npm install @google/generative-ai
```

### Step 2: Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Create `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
```

### Step 3: Run the App
```bash
npm run dev
```

Visit: http://localhost:3000/demo

## 🧠 How CSS Changes Work

### The Flow:
```
User Request → Gemini AI → JSON → React State → CSS Variables → UI Updates
```

### Example JSON from AI:
```json
{
  "ux_mode": "high_contrast",
  "theme": {
    "background_color": "#000000",
    "text_color": "#FFFF00",
    "primary_color": "#00FF00",
    ...
  },
  "typography": {
    "base_font_size_px": 24,
    ...
  },
  "layout_adjustments": {
    "hide_images": true,
    "highlighted_action_ids": ["submit-btn"]
  }
}
```

### CSS Variable Injection:
```tsx
// In StyleApplier.tsx
<div style={{
  '--bg': '#000000',
  '--text': '#FFFF00',
  '--base-font-size': '24px',
  ...
}}>
```

### Components Use Variables:
```css
/* In globals.css */
body {
  background: var(--bg);
  color: var(--text);
  font-size: var(--base-font-size);
}

.adaptive-button {
  padding: var(--button-padding);
  min-height: var(--button-min-height);
}
```

### Mode Classes Apply Presets:
```css
.accessibility-wrapper.high_contrast {
  --bg: #000000;
  --text: #FFFF00;
}
```

## 🎨 Part 1 (Frontend) Checklist

✅ **Types**: `accessibility.ts` defines the AI JSON schema  
✅ **State Management**: `StyleContext.tsx` stores current profile  
✅ **CSS Variables**: `StyleApplier.tsx` injects variables into DOM  
✅ **Global Styles**: `globals.css` has mode classes  
✅ **Components**: Adaptive buttons/cards/images respond to settings  
✅ **Demo Page**: Cluttered page with stable IDs  
✅ **Debug Panel**: Shows current JSON  

## 🧪 Part 2 (Backend) Checklist

✅ **API Route**: `/api/analyze/route.ts`  
✅ **Gemini Integration**: Sends prompt + screenshot  
✅ **Strict Prompt**: Forces JSON-only output  
✅ **Validation**: Parses JSON, validates structure  
✅ **Fallback**: Returns DEFAULT_PROFILE on error  

## 🎮 Testing the System

### Test 1: High Contrast
Click "High Contrast Mode" button → UI turns black with yellow text

### Test 2: Text Only
Click "Text Only Mode" → Images hidden, decorations removed

### Test 3: Motor Impaired
Click "Motor Impaired Mode" → Buttons become huge

### Test 4: Highlight Action
Click "Highlight Checkout Button" → Submit button glows with animation

### Test 5: Custom Request
Modify `handleAIAnalysis` to accept text input, try:
- "Make text bigger for seniors"
- "Remove distractions"
- "I'm colorblind"

## 🔌 Adding Camera/Voice Integration (Member 3)

When camera detects "blink twice":
```tsx
// In your camera component
const handleGesture = (gesture: string) => {
  if (gesture === 'blink_twice') {
    fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ 
        userRequest: 'simplify interface',
        screenshotBase64: captureScreen() 
      })
    }).then(res => res.json())
      .then(profile => updateSettings(profile));
  }
};
```

## 📊 Available Element IDs for Highlighting

```typescript
// These IDs exist in demo page and can be highlighted:
- "submit-btn"         // Checkout button
- "card-input"         // Credit card field
- "checkout-card"      // Entire checkout section
- "product-1/2/3"      // Product cards
- "buy-btn-1/2/3"      // Add to cart buttons
```

## 🎯 Key Concepts

### Why CSS Variables?
- **Dynamic**: AI can set ANY color/size
- **Fast**: No re-rendering, just style changes
- **Global**: One change affects entire app

### Why Mode Classes?
- **Presets**: Swap entire themes instantly
- **Override**: `.high_contrast` overrides defaults
- **Predictable**: Known configurations

### Why IDs for Highlighting?
- **Precise**: AI knows exact elements to highlight
- **Flexible**: Can highlight multiple elements
- **Visual**: Glow animation draws attention

## 🚀 Next Steps for Hackathon

1. **Test with real Gemini API key**
2. **Integrate with camera/voice (Member 3)**
3. **Add more accessibility modes**
4. **Add screenshot capture for context**
5. **Polish animations and transitions**
6. **Add user feedback/confirmation**

## 🐛 Troubleshooting

**AI returns invalid JSON?**
→ Check `route.ts` logs, adjust SYSTEM_PROMPT

**Styles not applying?**
→ Check browser DevTools → Elements → Computed styles for CSS variables

**Highlighting not working?**
→ Verify element IDs match between demo page and AI response

**API key error?**
→ Verify `.env.local` exists and has `GEMINI_API_KEY`

## 📝 Print This Workflow

1. User makes request (text/voice/gesture)
2. Member 3 captures request → sends to `/api/analyze`
3. Member 2's API calls Gemini with strict JSON prompt
4. Gemini returns `AccessibilityProfile` JSON
5. Member 1's frontend receives JSON → updates `styleSettings`
6. `StyleApplier` converts JSON → CSS variables
7. Mode class applied (`.high_contrast` etc)
8. All components re-render with new styles
9. Highlighted elements get glow animation
10. User sees instant UI transformation
