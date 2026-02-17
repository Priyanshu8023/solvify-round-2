"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unlock } from 'lucide-react';
import Particles from './Particles';

interface LevelTransitionProps {
  show: boolean;
  level: number;
}

const LevelTransition: React.FC<LevelTransitionProps> = ({ show, level }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
        >
          {/* Overlay Particles */}
          <div className="absolute inset-0 z-0 opacity-50">
            <Particles particleCount={50} particleColors={['#eab308']} speed={0.5} />
          </div>

          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="relative z-10 flex flex-col items-center text-center space-y-6"
          >
            {/* Icon Animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20 animate-pulse"></div>
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
                className="w-24 h-24 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.4)]"
              >
                <Unlock className="w-12 h-12 text-black" />
              </motion.div>
            </div>

            {/* Text Animation */}
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-yellow-500 font-mono text-xl tracking-[0.3em] uppercase"
              >
                Access Granted
              </motion.h2>

              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter"
              >
                LEVEL {level}
              </motion.h1>
            </div>

            {/* Loading Bar Animation */}
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.6, duration: 2, ease: "easeInOut" }}
                className="h-full bg-yellow-500 shadow-[0_0_10px_#eab308]"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
              className="text-xs font-mono text-yellow-500/80 animate-pulse"
            >
              INITIALIZING PROTOCOL...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelTransition;