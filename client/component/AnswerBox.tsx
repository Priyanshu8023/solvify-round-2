"use client";

import React from 'react';
import { Bot, Cpu, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnswerBoxProps {
  response: string | null;
  onClose: () => void;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ response, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-3xl mb-8 rounded-xl bg-[#09090b] border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)] relative overflow-hidden group"
        >

          <div className="bg-yellow-500/5 border-b border-yellow-500/20 p-2 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-2 text-xs font-mono text-yellow-400/80 tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI_CORE_RESPONSE // CLASSIFIED</span>
            </div>

            {/* Simple Close Button */}
            <button
              onClick={onClose}
              className="text-yellow-500/50 hover:text-red-400 transition-colors"
              title="Close Terminal"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 flex gap-6 items-start relative">

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none select-none"></div>
            <div className="flex-shrink-0 relative hidden sm:block select-none">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-xl animate-pulse"></div>
              <div className="relative w-14 h-14 bg-black/80 rounded-lg border border-yellow-500/50 flex items-center justify-center shadow-[inset_0_0_10px_rgba(234,179,8,0.2)]">
                <Bot className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-mono text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words select-text cursor-text">
                <span className="text-yellow-500 mr-2 select-none">{'>'}</span>
                {response}
                <span className="inline-block w-2.5 h-4 bg-yellow-500 ml-1 animate-[pulse_1s_ease-in-out_infinite] align-middle select-none" />
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnswerBox;