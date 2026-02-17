"use client";

import { useState, type FormEvent } from 'react';
import { Send, Bot, Loader2, Terminal, ShieldAlert, XCircle, Cpu, Lock, CheckCircle, AlertTriangle, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBorder from './Effects/starBorder';
import Particles from './Effects/Particles';
import LevelTransition from './Effects/LevelTransition';

// --- CONFIGURATION ---
const TOTAL_LEVELS = 8;
const LEVEL_PASSWORDS: Record<number, string> = {
  1: "PASSWORD_1",
  2: "PASSWORD_2",
  3: "PASSWORD_3",
  4: "PASSWORD_4",
  5: "PASSWORD_5",
  6: "PASSWORD_6",
  7: "PASSWORD_7",
  8: "PASSWORD_8",
};

// --- API Logic ---
interface ApiResponse {
  success: boolean;
  data: string;
}

const fetchGandalfResponse = async (prompt: string): Promise<ApiResponse> => {
  try {
    const token = localStorage.getItem('token');
    const API_URL = "http://localhost:5000/api/scrapper";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token || ''}`
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed");

    return { success: true, data: data.response || JSON.stringify(data) };

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      data: errorMessage.includes("token")
        ? "ACCESS DENIED: Authorization token missing. Please log in."
        : "CONNECTION ERROR: Unable to establish uplink with AI Core."
    };
  }
};

const MascotPrompt = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [level, setLevel] = useState<number>(1);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [showLevelTransition, setShowLevelTransition] = useState<boolean>(false);
  const [transitionLevel, setTransitionLevel] = useState<number>(1);

  const handleChatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    setResponse(null);
    setIsLoading(true);
    try {
      const result = await fetchGandalfResponse(query);
      setResponse(result.data);
    } catch (error) {
      setResponse("SYSTEM FAILURE: Unexpected data packet received.");
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    const correctPassword = LEVEL_PASSWORDS[level];

    if (passwordInput === correctPassword) {
      setVerifyStatus('success');
      const nextLevel = level + 1;
      setTransitionLevel(nextLevel);
      setTimeout(() => {
        setShowLevelTransition(true);
        setTimeout(() => {
          if (level < TOTAL_LEVELS) {
            setLevel(nextLevel);
            setPasswordInput('');
            setResponse(null);
            setVerifyStatus('idle');
            setTimeout(() => setShowLevelTransition(false), 1000);
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
      {/* Background Particles Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles particleCount={80} particleColors={['#ffffff', '#fbbf24']} particleSpread={20} speed={0.1} />
      </div>

      <LevelTransition
        show={showLevelTransition}
        level={transitionLevel <= TOTAL_LEVELS ? transitionLevel : TOTAL_LEVELS}
      />

      {/* Main Tactical Container - Added pt-24 to clear Navbar */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-8 pt-24 md:pt-28 gap-6 min-h-screen">

        {/* --- HEADER: TOP STATUS BAR --- */}
        <header className="flex flex-wrap items-center justify-between gap-4 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl">
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
          <section className="lg:col-span-8 flex flex-col bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
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

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
              <AnimatePresence mode="wait">
                {!response && !isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-5 opacity-20">
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
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center flex-shrink-0 shadow-[0_10px_25px_-5px_rgba(234,179,8,0.4)]">
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

            {/* PERSISTENT PROMPT INPUT */}
            <div className="p-6 md:p-8 bg-black/40 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4 px-3 text-[10px] font-mono uppercase text-yellow-500/60 tracking-widest">
                <Terminal className="w-3.5 h-3.5" />
                <span>Terminal Injection // Sector_{level}</span>
              </div>
              <StarBorder as="div" className="w-full p-[1px] rounded-[24px]" color={isFocused ? "#eab308" : "#fbbf24"} speed="4s">
                <form onSubmit={handleChatSubmit} className={`relative w-full flex items-center gap-3 p-2 pr-3 rounded-[23px] transition-all duration-500 bg-black ${isFocused ? 'shadow-[0_0_40px_rgba(234,179,8,0.15)] bg-neutral-900/40' : ''}`}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Engineer a prompt to reveal the password..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-700 px-5 h-12 text-sm md:text-base font-mono"
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={!query.trim() || isLoading} className="h-10 w-10 rounded-full flex items-center justify-center bg-yellow-500 text-black shadow-lg hover:bg-yellow-400 hover:scale-110 active:scale-95 transition-all disabled:opacity-10">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                  </button>
                </form>
              </StarBorder>
            </div>
          </section>

          {/* RIGHT: SECURITY CLEARANCE CONSOLE */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 bg-yellow-500/[0.03] border border-yellow-500/10 rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
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
                  <div className="p-5 border border-white/10 bg-black/60 rounded-[24px] space-y-3 shadow-inner">
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
                          'bg-yellow-500 text-black shadow-yellow-500/20 hover:translate-y-[-3px] hover:shadow-yellow-500/40 active:translate-y-0'}`}
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
      </main>
    </div>
  );
};

export default MascotPrompt;