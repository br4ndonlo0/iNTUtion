"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SilverTellerHub from "./components/SilverTellerHub";
import MoneyRain from "./components/MoneyRain";
import { LanguageButtons } from "@/components/LanguageSelector";
import { Mic, Hand, Accessibility } from "lucide-react";
import { useHandleAiResponse } from "@/hooks/useHandleAiResponse";




gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const ynbaTextRef = useRef<HTMLSpanElement>(null);
  const ynbaIconRef = useRef<SVGSVGElement>(null);
  const ynbaSubtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  
  const handleAiResponse = useHandleAiResponse();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.set([brandRef.current, ctaRef.current], {
        opacity: 0,
        y: 60,
      });

      // YNBA special initial states
      gsap.set(ynbaTextRef.current, {
        opacity: 0,
        x: -100,
        scale: 0.8,
      });

      gsap.set(ynbaIconRef.current, {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      gsap.set(ynbaSubtitleRef.current, {
        opacity: 0,
        y: 30,
      });

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .to(brandRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: 0.2,
        })
        // YNBA text slides in from left
        .to(
          ynbaTextRef.current,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        // Icon spins in
        .to(
          ynbaIconRef.current,
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.7"
        )
        // Subtitle fades up
        .to(
          ynbaSubtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .to(
          ctaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      // Continuous subtle animation for the icon
      gsap.to(ynbaIconRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });

      // Scroll animations for sections
      const sections = [section1Ref.current];
      
      sections.forEach((section) => {
        if (section) {
          const elements = section.querySelectorAll(".animate-on-scroll");
          
          gsap.set(elements, { opacity: 0, y: 100 });

          ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            onEnter: () => {
              gsap.to(elements, {
                opacity: 1,
                y: 0,
                color: "white",
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
              });
            },
          });
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="min-h-screen bg-white overflow-hidden relative">
      {/* Money rain background (behind everything) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <MoneyRain count={32} emoji="💸" />
      </div>
      {/* Hero Section - Clean and Simple */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-white">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Brand */}
          <h1
            ref={brandRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#C8102E] mb-8 tracking-tight"
          >
            Bank Buddy
          </h1>

          {/* YNBA Logo Style */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-4">
              <span
                ref={ynbaTextRef}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#C8102E] tracking-tight"
                style={{ fontFamily: 'Times New Roman, Georgia, serif' }}
              >
                YNBA
              </span>
              {/* Bank icon - matching the reference image */}
              <svg
                ref={ynbaIconRef}
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-[#C8102E]"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* Roof triangle */}
                <polygon points="50,2 5,32 95,32" fill="currentColor"/>
                {/* White cutouts on roof sides */}
                <polygon points="12,30 30,30 50,12" fill="white"/>
                <polygon points="88,30 70,30 50,12" fill="white"/>
                
                {/* Dollar sign */}
                <text x="50" y="28" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold" fontFamily="Arial">$</text>
                
                {/* Horizontal bar below roof */}
                <rect x="5" y="32" width="90" height="6" fill="currentColor"/>
                
                {/* Left tower */}
                <rect x="5" y="38" width="15" height="52" fill="currentColor"/>
                {/* Left pillar (white rounded) */}
                <rect x="9" y="44" width="7" height="40" fill="white" rx="3"/>
                
                {/* Right tower */}
                <rect x="80" y="38" width="15" height="52" fill="currentColor"/>
                {/* Right pillar (white rounded) */}
                <rect x="84" y="44" width="7" height="40" fill="white" rx="3"/>
                
                {/* Center building body */}
                <rect x="20" y="38" width="60" height="52" fill="currentColor"/>
                
                {/* White door/vault opening */}
                <rect x="26" y="44" width="48" height="40" fill="white" rx="2"/>
                
                {/* Cash notes in center */}
                {/* Back note */}
                <rect x="38" y="52" width="24" height="14" fill="currentColor" rx="2" transform="rotate(-10 50 59)"/>
                {/* Middle note */}
                <rect x="38" y="56" width="24" height="14" fill="currentColor" rx="2"/>
                <text x="50" y="66" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">$</text>
                {/* Front note */}
                <rect x="38" y="60" width="24" height="14" fill="currentColor" rx="2" transform="rotate(10 50 67)"/>
                <text x="50" y="70" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">$</text>
                
                {/* Base platform */}
                <rect x="2" y="90" width="96" height="8" fill="currentColor" rx="2"/>
              </svg>
            </div>
            <p ref={ynbaSubtitleRef} className="text-xl md:text-2xl text-[#C8102E] mt-4 italic">
              You&apos;ll Never Bank Alone
            </p>
          </div>

          {/* Simple CTA */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-10 py-4 bg-[#C8102E] text-white font-semibold rounded-full hover:bg-[#A50D26] transition-colors duration-300 text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 border-2 border-[#C8102E] text-[#C8102E] font-semibold rounded-full hover:bg-[#C8102E] hover:text-white transition-colors duration-300 text-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

{/* Scroll hint - Moved up slightly */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[-20%] z-30">
  <div className="w-9 h-14 border-2 border-[#C8102E] bg-white rounded-full flex justify-center shadow-xl">
    <div className="w-1.5 h-3 bg-[#C8102E] rounded-full mt-3 animate-bounce" />
  </div>
</div>
      </section>

{/* Section 1 - Why Bank Buddy */}
<section ref={section1Ref} className="relative overflow-hidden min-h-screen">
  
  {/* Layer 1: Background Image (NO animation class here) */}
  <div className="absolute inset-0 bg-black">
    <img 
      src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&auto=format&fit=crop&q=60"
      alt="Banking Background" 
      className="w-full h-full object-cover opacity-70"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent"></div>
  </div>

  {/* Layer 2: Red Swoosh (NO animation class here) */}
  <div 
    className="absolute inset-0 bg-[#C8102E]" 
    style={{
      clipPath: "polygon(0 65%, 100% 45%, 100% 100%, 0% 100%)"
    }}
  ></div>

  {/* Content Layer (This is where the animations live) */}
  <div className="relative z-10 pt-32 pb-20 px-6">
    <div className="max-w-6xl mx-auto text-center">
      
      {/* Headline area */}
      <div className="mb-32 animate-on-scroll">
        <h2 className="text-5xl md:text-7xl font-bold mb-5"
        style={{color: '#FFFFFF'}}>
          Banking accessible to all
        </h2>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
          Accessible banking through adaptive, multimodal design.
        </p>
      </div>
      
{/* Cards area */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
  <div className="w-full bg-white rounded-3xl p-10 shadow-2xl animate-on-scroll text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C8102E]/10">
      <Mic className="h-8 w-8 text-[#C8102E]" aria-hidden="true" />
    </div>
    <h3 className="text-2xl font-bold text-[#C8102E] mb-2 leading-snug">
      Voice Navigation
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Speech-based interaction to reduce reliance on touch and complex menus.
    </p>
  </div>

  <div className="w-full bg-white rounded-3xl p-10 shadow-2xl animate-on-scroll text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C8102E]/10">
      <Hand className="h-8 w-8 text-[#C8102E]" aria-hidden="true" />
    </div>
    <h3 className="text-2xl font-bold text-[#C8102E] mb-2 leading-snug">
      Motion Recognition
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Gesture-based controls enable hands-free and low-effort interaction.
    </p>
  </div>

  <div className="w-full bg-white rounded-3xl p-10 shadow-2xl animate-on-scroll text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#C8102E]/10">
      <Accessibility className="h-8 w-8 text-[#C8102E]" aria-hidden="true" />
    </div>
    <h3 className="text-2xl font-bold text-[#C8102E] mb-2 leading-snug">
      Barrier-Free Access
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Adaptive UI that removes accessibility barriers for diverse user needs.
    </p>
  </div>
</div>


    </div>
  </div>
</section>

      {/* SilverTellerHub - Mic and Camera */}
      <SilverTellerHub 
        screenName="Home" 
        onAiAction={handleAiResponse} 
      />

      {/* Footer */}
      <footer className="py-8 px-6 bg-white text-center border-t-2 border-[#C8102E]">
        <p className="text-[#C8102E] font-semibold">YNBA — You&apos;ll Never Bank Alone</p>
        <p className="text-[#C8102E] mt-2">© 2026 Bank Buddy. All rights reserved.</p>
      </footer>
    </div>
  );
}

