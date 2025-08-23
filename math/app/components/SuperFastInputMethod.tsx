'use client'

import React from 'react';
import AnswerBox from './math/answer-box';   

interface SuperFastInputMethodProps {
  className?: string;
}

const SuperFastInputMethod: React.FC<SuperFastInputMethodProps> = ({
  className = ""
}) => {

  return (
    <div className={`bg-[#E6E6FA] rounded-3xl flex flex-col items-center 
    justify-start pt-8 h-100 overflow-visible ${className}`}>
      {/* Japanese Title */}
      <h2 className="text-[#2B2B2B] text-7xl 
      md:text-7xl font-bold mb-4 text-center tracking-wide">
        超快輸入法
      </h2>
      
      {/* Input Field */}
      <div className="w-full max-w-md">
        <AnswerBox/>        
      </div>
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg border border-white/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-sm md:text-base font-semibold text-[#2B2B2B]">
            比 LaTeX 直觀的輸入法，快速地打出你像要的數學公式。
          </p>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      {/* Owl in Motion - Bottom Right Corner */}
      <div className="absolute bottom-0 -left-18 z-50">
        <img 
          src="/owl-in-motion.png" 
          alt="Owl character in motion" 
          className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
        />
      </div>
    </div>
  );
};

export default SuperFastInputMethod;
