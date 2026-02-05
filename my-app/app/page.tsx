"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SilverTellerHub from "./components/SilverTellerHub";
import { T } from "@/components/Translate";
import { LanguageButtonsFixed } from "@/components/LanguageButtonsFixed";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const ynbaTextRef = useRef<HTMLSpanElement>(null);
  const ynbaIconRef = useRef<SVGSVGElement>(null);
  const ynbaSubtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);

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
    <div ref={heroRef} className="min-h-screen bg-white overflow-hidden">
      <LanguageButtonsFixed />
      {/* Hero Section - Clean and Simple */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Brand */}
          <h1
            ref={brandRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#C8102E] mb-8 tracking-tight"
          >
            <T>Bank Buddy</T>
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
              <T>You&apos;ll Never Bank Alone</T>
            </p>
          </div>

          {/* Simple CTA */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-10 py-4 bg-[#C8102E] text-white font-semibold rounded-full hover:bg-[#A50D26] transition-colors duration-300 text-lg"
            >
              <T>Get Started</T>
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 border-2 border-[#C8102E] text-[#C8102E] font-semibold rounded-full hover:bg-[#C8102E] hover:text-white transition-colors duration-300 text-lg"
            >
              <T>Sign In</T>
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-[#C8102E] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#C8102E] rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Section 1 - Why Bank Buddy */}
      <section ref={section1Ref} className="py-32 px-6 bg-[#C8102E]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="animate-on-scroll text-4xl md:text-6xl font-bold text-white mb-8">
            <T>Banking Made Simple</T>
          </h2>
          <p className="animate-on-scroll text-xl md:text-2xl text-white mb-16 max-w-2xl mx-auto">
            <T>No complicated jargon. No hidden fees. Just straightforward banking that works for you.</T>
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-on-scroll bg-white rounded-2xl p-8">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-[#C8102E] mb-2"><T>Secure</T></h3>
              <p className="text-[#C8102E]"><T>Bank-grade encryption protects your data</T></p>
            </div>
            <div className="animate-on-scroll bg-white rounded-2xl p-8">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-[#C8102E] mb-2"><T>Fast</T></h3>
              <p className="text-[#C8102E]"><T>Instant transfers, real-time updates</T></p>
            </div>
            <div className="animate-on-scroll bg-white rounded-2xl p-8">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-xl font-bold text-[#C8102E] mb-2"><T>Smart</T></h3>
              <p className="text-[#C8102E]"><T>AI insights to help you save more</T></p>
            </div>
          </div>
        </div>
      </section>

      {/* SilverTellerHub - Mic and Camera */}
      <SilverTellerHub  screenName="Home"/>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white text-center border-t-2 border-[#C8102E]">
        <p className="text-[#C8102E] font-semibold"><T>YNBA — You&apos;ll Never Bank Alone</T></p>
        <p className="text-[#C8102E] mt-2"><T>© 2026 Bank Buddy. All rights reserved.</T></p>
      </footer>
    </div>
  );
}
