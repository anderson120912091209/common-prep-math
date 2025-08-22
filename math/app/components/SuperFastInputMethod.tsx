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
      <h2 className="text-[#2B2B2B] text-6xl 
      md:text-6xl font-bold mb-4 text-center">
        超快輸入法
      </h2>
      
      {/* Input Field */}
      <div className="w-full max-w-md">
        <AnswerBox/>        
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm md:text-base leading-relaxed
        text-gray-600 font-bold border-l-4 border-[#7A9CEB] pl-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-r-lg shadow-sm">
            比 LaTeX 直觀的輸入法，快速地打出你像要的數學公式。
        </p>
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
