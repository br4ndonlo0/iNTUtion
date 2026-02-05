// src/utils/aiBrain.js

// 1. Load the Key safely
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function getAiAction(transcript, gesture, screenName) {
  if (!API_KEY) {
    console.error("❌ CRITICAL: No API Key found in .env.local");
    return null;
  }

  // 2. The "Prompt Envelope" - This tells Gemini how to behave
  // We explicitly ask for JSON so we can use the data in code.
  const prompt = `
    SYSTEM CONTEXT:
    You are "BankBuddy", an assistive banking interface for elderly users in Singapore.
    Current Screen: "${screenName}"
    
    USER INPUTS:
    - Voice Transcript: "${transcript}"
    - Hand Gesture: "${gesture || "None"}"
    
    YOUR TASK:
    Analyze the inputs. If the user wants to do something, map it to a JSON Action.
    
    AVAILABLE ACTIONS (Strict JSON format):
    1. { "action": "NAVIGATE", "target": "transfer" | "home" | "history" }
    2. { "action": "FILL_FORM", "amount": <number>, "recipient": "<name>" }
    3. { "action": "CONFIRM" }  (Use this if gesture is Thumb_Up or user says Yes)
    4. { "action": "REJECT" }   (Use this if gesture is Thumb_Down or user says No)
    5. { "action": "UNKNOWN" }
    
    RULES:
    - Understand "Singlish" (e.g. "Can transfer 50 dollar to Ah Boy?" -> amount: 50, recipient: "Ah Boy").
    - If the gesture confirms the voice (e.g., Voice: "Pay now", Gesture: "Thumb_Up"), output CONFIRM.
    - Return ONLY the raw JSON object. Do not use Markdown formatting.
  `;

  try {
    console.log("🧠 AI Sending:", transcript);

    // 3. Call the Gemini API (REST method - no extra installation needed)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("❌ AI API Error:", data.error || response.statusText);
      return null;
    }

    // 4. Safety Parse
    // Gemini sometimes wraps code in backticks like \`\`\`json ... \`\`\`
    // We clean that up before parsing.

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("❌ AI returned empty response");
      return null;
    }
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const actionJson = JSON.parse(rawText);
    console.log("🧠 AI Decided:", actionJson);
    return actionJson;
  } catch (error) {
    console.error("❌ AI Brain Error:", error);
    return null;
  }
}
