"use client";

import { useState, type FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, Loader2, Terminal, ShieldAlert, XCircle, Cpu, Lock, CheckCircle, AlertTriangle, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBorder from './Effects/starBorder';
import LevelTransition from './Effects/LevelTransition';


import { Scrapper } from '../services/api';

const TOTAL_LEVELS = 8;

interface PromptBoxProps {
  initialLevel?: number;
}

const MascotPrompt = ({ initialLevel = 1 }: PromptBoxProps) => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [level, setLevel] = useState<number>(initialLevel);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [showLevelTransition, setShowLevelTransition] = useState<boolean>(false);
  const [transitionLevel, setTransitionLevel] = useState<number>(1);
  const [questionDesc, setQuestionDesc] = useState<string | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [query]);

  // Fetch question on level change
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/${level}`);
        const data = await res.json();
        if (data.question) {
          setQuestionDesc(data.question.question);
          setCorrectAnswer(data.question.answer);
          setTargetUrl(data.question.url || '');
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    };
    fetchQuestion();
  }, [level]);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    setResponse(null);
    setIsLoading(true);
    try {
      const answer = await Scrapper.askScrapper(query, targetUrl);
      setResponse(answer);
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      setResponse(
        errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized")
          ? "ACCESS DENIED: Authorization token missing. Please log in."
          : `CONNECTION ERROR: ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    if (correctAnswer && passwordInput === correctAnswer) {
      setVerifyStatus('success');
      const nextLevel = level + 1;
      setTransitionLevel(nextLevel);
      setTimeout(() => {
        setShowLevelTransition(true);
        setTimeout(() => {
          if (level < TOTAL_LEVELS) {
            router.push(`/${nextLevel}`);
          } else {
            alert("ALL LEVELS CLEARED! CONGRATULATIONS.");
            setShowLevelTransition(false);
          }
        }, 2500);
      }, 800);
    } else {
      setVerifyStatus('error');
      setTimeout(() => setVerifyStatus('idle'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-yellow-500/30 flex flex-col">

      <LevelTransition
        show={showLevelTransition}
        level={transitionLevel <= TOTAL_LEVELS ? transitionLevel : TOTAL_LEVELS}
      />
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-8 pt-24 md:pt-10 gap-6 min-h-screen">

        {/* --- HEADER: TOP STATUS BAR --- */}
        <header className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-4 -mt-7 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-yellow-500/50 uppercase tracking-[0.2em]">Operational Sector</span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">Byte Battle 3.0 // Level {level}</h2>
            </div>
            <div className="hidden md:flex gap-1.5 ml-6">
              {Array.from({ length: TOTAL_LEVELS }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={i + 1 === level ? { opacity: [0.3, 1, 0.3] } : { opacity: i + 1 < level ? 1 : 0.3 }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`h-7 w-1.5 rounded-full ${i + 1 <= level ? 'bg-yellow-500 shadow-[0_0_12px_#eab308]' : 'bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-green-500/70">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>CORE_STABLE</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Globe className="w-3.5 h-3.5" />
              <span>Secure Uplink</span>
            </div>
          </div>
        </header>

        {/* --- CONTENT GRID --- */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

          {/* LEFT: AI EXTRACTION TERMINAL */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {/* Mission Briefing / Question Description */}
            <div className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Mission Objective</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                {questionDesc ? (
                  <p className="font-mono text-sm md:text-base text-gray-300 leading-relaxed">
                    {questionDesc}
                  </p>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-500/50">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-widest">Loading Intel...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-yellow-500" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Extraction Protocol</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-2 scrollbar-hide min-h-[300px]">
                <AnimatePresence mode="wait">
                  {!response && !isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-1 opacity-20">
                      <Bot className="w-20 h-20" />
                      <div className="space-y-1">
                        <p className="font-mono text-xs tracking-[0.3em] uppercase">Neural link standby</p>
                        <p className="text-[10px] font-mono text-white/40 italic">Awaiting interrogation input...</p>
                      </div>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 text-yellow-500 p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/10">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-mono text-xs uppercase tracking-widest">Bypassing Firewall Protections...</span>
                    </motion.div>
                  )}

                  {response && (
                    <motion.div key="response" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center shrink-0 shadow-[0_10px_25px_-5px_rgba(234,179,8,0.4)]">
                        <Bot className="w-7 h-7 text-black" />
                      </div>
                      <div className="bg-[#111111] border border-white/10 p-6 rounded-3xl rounded-tl-none relative group shadow-xl">
                        <p className="text-sm md:text-base font-mono leading-relaxed text-gray-200">
                          <span className="text-yellow-500 font-bold mr-3">AI_LOG:</span>
                          {response}
                        </p>
                        <button onClick={() => setResponse(null)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 md:p-8 bg-black/40 border-t border-white/10">
                <div className="flex items-center gap-2 mb-4 px-3 text-[10px] font-mono uppercase text-yellow-500/60 tracking-widest">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal Injection // Sector_{level}</span>
                </div>
                <StarBorder as="div" className="w-full p-px rounded-3xl" color={isFocused ? "#eab308" : "#fbbf24"} speed="4s">
                  <form onSubmit={handleChatSubmit} className={`relative w-full flex items-center gap-3 p-2 pr-3 rounded-[23px] transition-all duration-500 bg-black ${isFocused ? 'shadow-[0_0_40px_rgba(234,179,8,0.15)] bg-neutral-900/40' : ''}`}>
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit(e as any);
                        }
                      }}
                      placeholder="Engineer a prompt to reveal the password..."
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-700 px-5 py-3 min-h-[48px] text-sm md:text-base font-mono resize-none overflow-hidden"
                      rows={1}
                      disabled={isLoading}
                    />
                    <button type="submit" disabled={!query.trim() || isLoading} className="h-10 w-10 rounded-full flex items-center justify-center bg-yellow-500 text-black shadow-lg hover:bg-yellow-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-10">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                    </button>
                  </form>
                </StarBorder>
              </div>
            </div>
          </section>

          {/* RIGHT: SECURITY CLEARANCE CONSOLE */}
          <section className="lg:col-span-4 flex flex-col gap-6 h-fit">
            <div className="flex-1 bg-yellow-500/3 border border-yellow-500/10 rounded-4xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full group-hover:bg-yellow-500/10 transition-all duration-1000"></div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 shadow-inner">
                    <ShieldAlert className="w-7 h-7 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Encryption Lock</h3>
                    <p className="text-[10px] font-mono text-yellow-500/60 uppercase">Defenses: Level_{level} Active</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-xs text-gray-400 font-mono leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    Once the password is extracted from the terminal, input it below to initiate the sector override.
                  </p>
                  <div className="p-5 border border-white/10 bg-black/60 rounded-3xl space-y-3 shadow-inner">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                      <span className="text-gray-500">Integrity Status</span>
                      <span className="text-yellow-500">{(100 / level).toFixed(0)}% Stable</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${100 / level}%` }} className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2 px-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Auth Unit</span>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <motion.div animate={verifyStatus === 'error' ? { x: [-6, 6, -6, 6, 0] } : {}} className="relative">
                    <input
                      type="text"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter Decrypted Key..."
                      className={`w-full bg-black border rounded-3xl h-16 px-6 text-sm font-mono transition-all duration-500 outline-none
                           ${verifyStatus === 'success' ? 'border-green-500 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.15)]' :
                          verifyStatus === 'error' ? 'border-red-500 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.15)]' :
                            'border-white/10 focus:border-yellow-500/50 focus:bg-white/5'}`}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                      {verifyStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {verifyStatus === 'error' && <AlertTriangle className="w-6 h-6 text-red-500" />}
                    </div>
                  </motion.div>

                  <button
                    type="submit"
                    className={`w-full h-16 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl
                        ${verifyStatus === 'success' ? 'bg-green-500 text-black' :
                        verifyStatus === 'error' ? 'bg-red-500 text-white' :
                          'bg-yellow-500 text-black shadow-yellow-500/20 hover:-translate-y-0.75 hover:shadow-yellow-500/40 active:translate-y-0'}`}
                  >
                    {verifyStatus === 'success' ? 'Sector Decrypted' : verifyStatus === 'error' ? 'Key Rejected' : 'Initiate Override'}
                  </button>
                </form>
              </div>
            </div>

            <footer className="text-center py-4">
              <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.4em]">Solvify Tactical Ops // NMIT CSE</p>
            </footer>
          </section>
        </div>
      </main >
    </div >
  );
};

export default MascotPrompt;