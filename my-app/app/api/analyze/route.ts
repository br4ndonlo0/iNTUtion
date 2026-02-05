import { NextRequest, NextResponse } from 'next/server';
import { AccessibilityProfile, DEFAULT_PROFILE } from '@/types/accessibility';

// Install: npm install @google/generative-ai
// Get your API key from: https://makersuite.google.com/app/apikey
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are an accessibility expert AI that analyzes user requests and returns ONLY valid JSON.

Your job: Convert user accessibility needs into a structured JSON profile.

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown, no explanations
2. Never add extra keys outside the schema
3. All fields are required
4. Use exact key names from schema
5. If unsure, use safe defaults

SCHEMA:
{
  "ux_mode": "default" | "high_contrast" | "text_only" | "dyslexia_friendly" | "motor_impaired",
  "theme": {
    "background_color": "#RRGGBB",
    "text_color": "#RRGGBB",
    "primary_color": "#RRGGBB",
    "secondary_color": "#RRGGBB",
    "border_color": "#RRGGBB"
  },
  "typography": {
    "base_font_size_px": number (14-32),
    "heading_scale": number (1.2-2.0),
    "line_height": number (1.4-2.0),
    "letter_spacing_em": number (0-0.2),
    "font_family": string
  },
  "layout_adjustments": {
    "hide_images": boolean,
    "hide_decorative_elements": boolean,
    "button_padding_px": number (10-30),
    "button_min_height_px": number (40-80),
    "spacing_scale": number (1-2),
    "highlighted_action_ids": string[] (IDs of elements to highlight)
  }
}

COMMON MAPPINGS:
- "high contrast" → ux_mode: "high_contrast", black bg, yellow text
- "hide images" → hide_images: true
- "bigger buttons" / "motor impaired" → ux_mode: "motor_impaired", large padding
- "dyslexia" → ux_mode: "dyslexia_friendly", Comic Sans/OpenDyslexic
- "text only" → ux_mode: "text_only", hide_images: true, hide_decorative_elements: true
- "find checkout" / "highlight submit" → add relevant IDs to highlighted_action_ids

Available element IDs in the page:
- "submit-btn" (checkout button)
- "card-input" (credit card input)
- "checkout-card" (entire checkout section)
- "product-1", "product-2", "product-3" (product cards)
- "buy-btn-1", "buy-btn-2", "buy-btn-3" (add to cart buttons)

EXAMPLES:

User: "I need high contrast"
{
  "ux_mode": "high_contrast",
  "theme": {
    "background_color": "#000000",
    "text_color": "#FFFF00",
    "primary_color": "#00FF00",
    "secondary_color": "#FFFFFF",
    "border_color": "#FFFFFF"
  },
  "typography": {
    "base_font_size_px": 18,
    "heading_scale": 1.6,
    "line_height": 1.6,
    "letter_spacing_em": 0.05,
    "font_family": "Arial, sans-serif"
  },
  "layout_adjustments": {
    "hide_images": false,
    "hide_decorative_elements": false,
    "button_padding_px": 16,
    "button_min_height_px": 48,
    "spacing_scale": 1.2,
    "highlighted_action_ids": []
  }
}

User: "Help me find checkout"
{
  "ux_mode": "default",
  "theme": {
    "background_color": "#ffffff",
    "text_color": "#000000",
    "primary_color": "#3b82f6",
    "secondary_color": "#6b7280",
    "border_color": "#e5e7eb"
  },
  "typography": {
    "base_font_size_px": 20,
    "heading_scale": 1.5,
    "line_height": 1.6,
    "letter_spacing_em": 0,
    "font_family": "system-ui, sans-serif"
  },
  "layout_adjustments": {
    "hide_images": false,
    "hide_decorative_elements": true,
    "button_padding_px": 16,
    "button_min_height_px": 48,
    "spacing_scale": 1.2,
    "highlighted_action_ids": ["submit-btn", "checkout-card"]
  }
}

Now process the user's request and return ONLY JSON:`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userRequest, screenshotBase64 } = body;

    if (!userRequest) {
      return NextResponse.json(
        { error: 'userRequest is required' },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not set, returning default profile');
      return NextResponse.json(DEFAULT_PROFILE);
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${SYSTEM_PROMPT}\n\nUser request: "${userRequest}"`;

    // If screenshot provided, include it
    let result;
    if (screenshotBase64) {
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/png',
            data: screenshotBase64,
          },
        },
      ]);
    } else {
      result = await model.generateContent(prompt);
    }

    const responseText = result.response.text();
    
    // Clean up response (remove markdown code blocks if present)
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7);
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    // Parse JSON
    const parsedProfile: AccessibilityProfile = JSON.parse(cleanedResponse);

    // Validate required fields
    if (!parsedProfile.ux_mode || !parsedProfile.theme || !parsedProfile.typography || !parsedProfile.layout_adjustments) {
      throw new Error('Invalid profile structure');
    }

    return NextResponse.json(parsedProfile);
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Return default profile as fallback
    return NextResponse.json(DEFAULT_PROFILE);
  }
}
