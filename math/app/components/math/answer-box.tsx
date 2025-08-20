'use client'

import React, { useState, useEffect, useRef } from 'react';

interface AnswerBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ 
  placeholder = "在此寫下您的答案...",
  value = "",
  onChange,
  className = ""
}) => {
  const [mathValue, setMathValue] = useState(value);
  const [showSymbols, setShowSymbols] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [MathQuill, setMathQuill] = useState<any>(null);
  const [mathField, setMathField] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    setMathValue(value);
  }, [value]);

  // Load MathQuill only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      const loadMathQuill = async () => {
        try {
          const { addStyles, EditableMathField } = await import('react-mathquill');
          addStyles();
          setMathQuill({ EditableMathField });
        } catch (error) {
          console.error('Failed to load MathQuill:', error);
        }
      };
      loadMathQuill();
    }
  }, [isClient]);

  const handleMathChange = (mathField: any) => {
    const latex = mathField.latex();
    setMathValue(latex);
    onChange?.(latex);
    setMathField(mathField);
  };

  const insertSymbol = (symbol: string) => {
    if (mathField) {
      mathField.write(symbol);
    }
  };

  const commonSymbols = [
    { label: '分數', symbol: '\\frac{a}{b}' },
    { label: '根號', symbol: '\\sqrt{x}' },
    { label: '次方', symbol: 'x^n' },
    { label: '積分', symbol: '\\int_{a}^{b}' },
    { label: '求和', symbol: '\\sum_{i=1}^{n}' },
    { label: '極限', symbol: '\\lim_{x \\to a}' },
    { label: '導數', symbol: '\\frac{d}{dx}' },
    { label: '等於', symbol: '=' },
    { label: '不等於', symbol: '\\neq' },
    { label: '小於等於', symbol: '\\leq' },
    { label: '大於等於', symbol: '\\geq' },
    { label: 'π', symbol: '\\pi' },
    { label: 'θ', symbol: '\\theta' },
    { label: 'α', symbol: '\\alpha' },
    { label: 'β', symbol: '\\beta' },
  ];

  // Show loading state while MathQuill is loading
  if (!isClient || !MathQuill) {
    return (
      <div className={`bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative ${className}`}>
        <div className="w-full h-16 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative overflow-visible ${className}`}>
      {/* MathQuill Input Field */}
      <div className="relative" ref={containerRef}>
        <MathQuill.EditableMathField
          latex={mathValue}
          onChange={handleMathChange}
          className="w-full bg-transparent text-gray-600 placeholder-gray-400 resize-none outline-none text-sm leading-relaxed min-h-[60px] pr-12"
        />
        
        {/* Math Symbols Button */}
        <button
          type="button"
          onClick={() => setShowSymbols(!showSymbols)}
          className="absolute top-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
        >
          fx
        </button>
      </div>

      {/* Math Symbols Panel */}
      {showSymbols && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg p-2 z-50 max-h-48 w-full">
          <div className="flex justify-between items-center mb-1 flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-900">數學符號</h3>
            <button 
              onClick={() => setShowSymbols(false)}
              className="w-5 h-5 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-36 pr-1">
            <div className="grid grid-cols-3 gap-1">
              {commonSymbols.map((item, index) => (
                <button
                  key={index}
                  onClick={() => insertSymbol(item.symbol)}
                  className="bg-gray-100 hover:bg-blue-200 border border-gray-300 rounded p-1 text-xs text-center transition-colors text-gray-800 font-medium"
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{item.symbol}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/>
            </svg>
            加入圖片
          </button>
          <button className="bg-blue-200 hover:bg-blue-300 text-blue-900 px-2 py-1 rounded-full text-xs font-medium">
            新增
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            繪圖
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            評分標準
          </button>
          <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            評分答案
            <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerBox;    