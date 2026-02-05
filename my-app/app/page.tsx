"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import SilverTellerHub from "./components/SilverTellerHub";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set([logoRef.current, titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 50,
      });

      gsap.set(floatingRefs.current, {
        opacity: 0,
        scale: 0,
      });

      // Main timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.5"
        )
        .to(
          subtitleRef.current,
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
        )
        .to(
          floatingRefs.current,
          {
            opacity: 0.6,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.5"
        );

      // Floating animation for decorative elements
      floatingRefs.current.forEach((el, i) => {
        if (el) {
          gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        }
      });

      // Scroll-triggered animations for features
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.set(featureCards, { opacity: 0, y: 80 });

        ScrollTrigger.create({
          trigger: featuresRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(featureCards, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
            });
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const setFloatingRef = (index: number) => (el: HTMLDivElement | null) => {
    floatingRefs.current[index] = el;
  };

  return (
    <div ref={heroRef} className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50 to-white" />
        
        {/* Floating Decorative Elements */}
        <div
          ref={setFloatingRef(0)}
          className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[#C8102E]/10 blur-xl"
        />
        <div
          ref={setFloatingRef(1)}
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-[#C8102E]/15 blur-2xl"
        />
        <div
          ref={setFloatingRef(2)}
          className="absolute bottom-40 left-20 w-24 h-24 rounded-full bg-[#C8102E]/10 blur-xl"
        />
        <div
          ref={setFloatingRef(3)}
          className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-[#C8102E]/20 blur-lg"
        />
        <div
          ref={setFloatingRef(4)}
          className="absolute top-1/3 left-1/4 w-12 h-12 rounded-full bg-[#C8102E]/10 blur-lg"
        />
        <div
          ref={setFloatingRef(5)}
          className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-[#C8102E]/10 blur-xl"
        />

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div ref={logoRef} className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#C8102E] to-[#A50D26] shadow-2xl shadow-[#C8102E]/30">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8102E] to-[#E31837]">
              Bank Buddy
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Your trusted companion for smarter banking. Experience seamless transactions, 
            secure accounts, and personalized financial guidance.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#C8102E] to-[#A50D26] text-white font-semibold rounded-full shadow-lg shadow-[#C8102E]/30 hover:shadow-xl hover:shadow-[#C8102E]/40 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#A50D26] to-[#C8102E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-[#C8102E] text-[#C8102E] font-semibold rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-300 hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-[#C8102E]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose <span className="text-[#C8102E]">Bank Buddy</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-[#C8102E]/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#C8102E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-level encryption and multi-factor authentication.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-[#C8102E]/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#C8102E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Instant transfers and real-time updates. Your money moves as fast as you do.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="w-14 h-14 rounded-xl bg-[#C8102E]/10 flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#C8102E]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered analytics help you understand your spending and save more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#C8102E] to-[#A50D26]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">$2M+</div>
              <div className="text-white/80">Transactions</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-white/80">Uptime</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Banking?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied users who have made the switch to smarter, 
            more intuitive banking with Bank Buddy.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-[#C8102E] to-[#A50D26] text-white font-semibold text-lg rounded-full shadow-lg shadow-[#C8102E]/30 hover:shadow-xl hover:shadow-[#C8102E]/40 transition-all duration-300 hover:scale-105"
          >
            Create Your Account
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
      <SilverTellerHub  screenName="Home"/>
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400">
          © 2026 Bank Buddy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
