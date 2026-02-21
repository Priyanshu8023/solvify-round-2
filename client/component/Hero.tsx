'use client';

import { useEffect, useState, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ style: CSSProperties }>>([]);
  const router = useRouter()
  useEffect(() => {
    setIsVisible(true);
    setParticles(
      Array.from({ length: 15 }).map(() => ({
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        } as CSSProperties,
      }))
    );
  }, []);

  return (
    <section className="min-h-screen bg-[#080805] py-30 flex items-center justify-center px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#ffd700] rounded-full opacity-40"
            style={particle.style}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Congratulations Message */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-block mb-4">
            <span className="px-6 py-2 text-sm font-bold text-[#ffd700] border-2 border-[#ffd700]/50 rounded-full backdrop-blur-sm bg-[#ffd700]/10 animate-pulse">
              ✦ ROUND 1 COMPLETE ✦
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Congratulations on Clearing
            <br />
            <span className="bg-linear-to-r from-[#ffd700] via-yellow-300 to-[#ffd700] bg-clip-text text-transparent bg-size-[200%_100%] animate-gradient">
              The First Round!
            </span>
          </h1>
        </div>

        {/* Round 2 Introduction */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-[#ffd700] mb-8">
            Welcome to Round 2: The AI Challenge
          </h2>

          <div className="bg-linear-to-br from-[#ffd700]/5 to-transparent border border-[#ffd700]/20 rounded-lg p-8 md:p-10 backdrop-blur-sm mb-8">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              Get ready for a <span className="text-[#ffd700] font-bold">40-minute interactive AI challenge</span> where you'll work individually to unlock a series of <span className="text-[#ffd700] font-bold">eight digital levels</span> by communicating with an AI system.
            </p>

            {/* Challenge Points */}
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-[#080805]/50 border border-[#ffd700]/10 rounded-lg p-6 hover:border-[#ffd700]/30 transition-all duration-300 group">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🔐</div>
                  <div>
                    <h3 className="text-[#ffd700] font-bold mb-2 group-hover:text-yellow-300 transition-colors">Hidden Passwords</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Each level is protected by a password that can only be discovered through carefully crafted prompts
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#080805]/50 border border-[#ffd700]/10 rounded-lg p-6 hover:border-[#ffd700]/30 transition-all duration-300 group">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <h3 className="text-[#ffd700] font-bold mb-2 group-hover:text-yellow-300 transition-colors">Strategic Thinking</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Analyze clues, test different strategies, and adapt your approach as the AI becomes more restrictive
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#080805]/50 border border-[#ffd700]/10 rounded-lg p-6 hover:border-[#ffd700]/30 transition-all duration-300 group">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h3 className="text-[#ffd700] font-bold mb-2 group-hover:text-yellow-300 transition-colors">Progressive Difficulty</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Each unlocked level awards points, with higher levels granting increased scores
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#080805]/50 border border-[#ffd700]/10 rounded-lg p-6 hover:border-[#ffd700]/30 transition-all duration-300 group">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h3 className="text-[#ffd700] font-bold mb-2 group-hover:text-yellow-300 transition-colors">Victory Conditions</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Speed, accuracy, and creativity determine your ranking. Unlock the most levels in the least time to win!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8">
            <div className="bg-linear-to-br from-[#ffd700]/10 to-transparent border border-[#ffd700]/20 rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-5xl font-black text-[#ffd700] mb-2">40</div>
              <div className="text-xs md:text-sm text-gray-400 font-medium">Minutes</div>
            </div>
            <div className="bg-linear-to-br from-[#ffd700]/10 to-transparent border border-[#ffd700]/20 rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-5xl font-black text-[#ffd700] mb-2">8</div>
              <div className="text-xs md:text-sm text-gray-400 font-medium">Levels</div>
            </div>
            <div className="bg-linear-to-br from-[#ffd700]/10 to-transparent border border-[#ffd700]/20 rounded-lg p-4 md:p-6">
              <div className="text-3xl md:text-5xl font-black text-[#ffd700] mb-2">1</div>
              <div className="text-xs md:text-sm text-gray-400 font-medium">Winner</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <p className="text-gray-400 text-lg mb-6">
              Ready to prove your AI mastery?
            </p>
            <button onClick={() => { router.push(`/1`) }} className="group relative px-10 py-4 text-lg font-bold text-[#080805] bg-[#ffd700] overflow-hidden transition-all duration-300 hover:scale-105">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Enter Round 2
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}