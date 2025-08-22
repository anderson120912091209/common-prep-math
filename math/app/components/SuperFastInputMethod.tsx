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
    justify-center h-100 ${className}`}>
      {/* Japanese Title */}
      <h2 className="text-[#2B2B2B] text-5xl 
      md:text-5xl font-bold mb-4 text-center">
        超快輸入法
      </h2>
      
      {/* Input Field */}
      <div className="w-full max-w-md">
        <AnswerBox/>        
      </div>
    </div>
  );
};

export default SuperFastInputMethod;
