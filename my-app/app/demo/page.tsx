'use client';

import { AdaptiveButton } from '@/components/AdaptiveButton';
import { AdaptiveCard } from '@/components/AdaptiveCard';
import { AdaptiveImage } from '@/components/AdaptiveImage';
import { useStyle } from '@/context/StyleContext';
import { AccessibilityProfile } from '@/types/accessibility';
import { useState } from 'react';
import SilverTellerHub from './components/SilverTellerHub';

export default function DemoPage() {
  const { styleSettings, updateSettings } = useStyle();
  const [isLoading, setIsLoading] = useState(false);

  const handleAIAnalysis = async (userRequest: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userRequest,
          // Optional: add screenshot base64 here
        }),
      });
      
      if (response.ok) {
        const newProfile: AccessibilityProfile = await response.json();
        updateSettings(newProfile);
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      {/* Header with decorative banner */}
      <header className="decorative mb-8 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded">
        <h1 className="text-4xl font-bold">Welcome to Our Store!</h1>
        <p className="text-sm mt-2">🎉 Special offers inside! Limited time only! 🎉</p>
      </header>

      {/* Sidebar with ads */}
      <div className="flex gap-8">
        <aside className="decorative w-64 space-y-4">
          <div className="border p-4 rounded bg-yellow-100">
            <h3 className="font-bold text-xs">Advertisement</h3>
            <p className="text-xs mt-2">Buy now! 50% off!</p>
            <AdaptiveImage 
              src="/ad-banner.jpg" 
              alt="Advertisement banner"
              className="mt-2 w-full h-24 object-cover"
            />
          </div>
          <div className="border p-4 rounded bg-blue-100">
            <h3 className="font-bold text-xs">Newsletter</h3>
            <input 
              type="email" 
              placeholder="Your email"
              className="w-full p-1 text-xs mt-2 border rounded"
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Product Showcase</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <AdaptiveCard id="product-1">
                <AdaptiveImage 
                  src="/product1.jpg" 
                  alt="Product 1"
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-semibold">Premium Widget</h3>
                <p className="text-sm">$99.99</p>
                <AdaptiveButton id="buy-btn-1" className="mt-2 w-full">
                  Add to Cart
                </AdaptiveButton>
              </AdaptiveCard>

              <AdaptiveCard id="product-2">
                <AdaptiveImage 
                  src="/product2.jpg" 
                  alt="Product 2"
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-semibold">Deluxe Gadget</h3>
                <p className="text-sm">$149.99</p>
                <AdaptiveButton id="buy-btn-2" className="mt-2 w-full">
                  Add to Cart
                </AdaptiveButton>
              </AdaptiveCard>

              <AdaptiveCard id="product-3">
                <AdaptiveImage 
                  src="/product3.jpg" 
                  alt="Product 3"
                  className="w-full h-32 object-cover mb-2"
                />
                <h3 className="font-semibold">Super Tool</h3>
                <p className="text-sm">$199.99</p>
                <AdaptiveButton id="buy-btn-3" className="mt-2 w-full">
                  Add to Cart
                </AdaptiveButton>
              </AdaptiveCard>
            </div>
          </section>

          <section className="mb-8">
            <AdaptiveCard id="checkout-card">
              <h2 className="text-xl font-semibold mb-4">Checkout</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Card Number</label>
                  <input 
                    id="card-input"
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Expiry</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm mb-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <AdaptiveButton id="submit-btn" className="w-full">
                  Complete Purchase
                </AdaptiveButton>
              </div>
            </AdaptiveCard>
          </section>

          {/* AI Command Section */}
          <section className="mt-12 border-t-4 pt-8">
            <AdaptiveCard>
              <h2 className="text-2xl font-semibold mb-4">AI Accessibility Controls</h2>
              <p className="mb-4">Click a button to test AI-driven accessibility modes:</p>
              
              <div className="grid grid-cols-2 gap-4">
                <AdaptiveButton 
                  onClick={() => handleAIAnalysis('I need high contrast')}
                  disabled={isLoading}
                >
                  High Contrast Mode
                </AdaptiveButton>
                
                <AdaptiveButton 
                  onClick={() => handleAIAnalysis('Hide all images and decorations')}
                  disabled={isLoading}
                >
                  Text Only Mode
                </AdaptiveButton>
                
                <AdaptiveButton 
                  onClick={() => handleAIAnalysis('Make text easier to read for dyslexia')}
                  disabled={isLoading}
                >
                  Dyslexia Friendly
                </AdaptiveButton>
                
                <AdaptiveButton 
                  onClick={() => handleAIAnalysis('I have motor impairment, make buttons bigger')}
                  disabled={isLoading}
                >
                  Motor Impaired Mode
                </AdaptiveButton>
                
                <AdaptiveButton 
                  onClick={() => handleAIAnalysis('Help me find the checkout button')}
                  disabled={isLoading}
                  className="col-span-2"
                >
                  🎯 Highlight Checkout Button
                </AdaptiveButton>
              </div>

              {isLoading && (
                <div className="mt-4 text-center">
                  <p>AI is analyzing your request...</p>
                </div>
              )}
            </AdaptiveCard>
          </section>

          {/* Debug Panel */}
          <section className="mt-8 opacity-50">
            <details className="border rounded p-4">
              <summary className="cursor-pointer font-semibold">
                Debug: Current Accessibility Settings
              </summary>
              <pre className="mt-4 text-xs overflow-auto">
                {JSON.stringify(styleSettings, null, 2)}
              </pre>
            </details>
          </section>
        </main>
      </div>
      <SilverTellerHub screenName="Demo" />
    </div>
  );
}
