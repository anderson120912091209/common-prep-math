'use client'

import React, { useState, useEffect, useRef } from 'react';

interface AnswerBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  showSampleQuestion?: boolean;
}

const AnswerBox: React.FC<AnswerBoxProps> = ({ 
  placeholder = "在此寫下您的答案...",
  value = "",
  onChange,
  className = "",
  showSampleQuestion = true
}) => {
  const defaultEquation = "\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}";
  const [mathValue, setMathValue] = useState(value || defaultEquation);
  const [showSymbols, setShowSymbols] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [MathQuill, setMathQuill] = useState<any>(null);
  const [mathField, setMathField] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    if (value) {
      setMathValue(value);
    }
  }, [value]);

  // Load MathQuill only on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && isClient) {
      const loadMathQuill = async () => {
        try {
          const { addStyles, EditableMathField } = await import('react-mathquill');
          addStyles();
          setMathQuill({ EditableMathField });
          // Ensure default value is set after MathQuill loads
          if (!value) {
            setMathValue(defaultEquation);
          }
        } catch (error) {
          console.error('Failed to load MathQuill:', error);
        }
      };
      loadMathQuill();
    }
  }, [isClient, value, defaultEquation]);

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
    // Basic Operations
    { label: '加', symbol: '+' },
    { label: '減', symbol: '-' },
    { label: '乘', symbol: '\\times' },
    { label: '除', symbol: '\\div' },
    { label: '等於', symbol: '=' },
    { label: '不等於', symbol: '\\neq' },
    { label: '約等於', symbol: '\\approx' },
    { label: '恆等於', symbol: '\\equiv' },
    
    // Inequalities
    { label: '小於', symbol: '<' },
    { label: '大於', symbol: '>' },
    { label: '小於等於', symbol: '\\leq' },
    { label: '大於等於', symbol: '\\geq' },
    { label: '遠小於', symbol: '\\ll' },
    { label: '遠大於', symbol: '\\gg' },
    
    // Fractions and Roots
    { label: '分數', symbol: '\\frac{a}{b}' },
    { label: '根號', symbol: '\\sqrt{x}' },
    { label: '立方根', symbol: '\\sqrt[3]{x}' },
    { label: 'n次根', symbol: '\\sqrt[n]{x}' },
    
    // Powers and Subscripts
    { label: '次方', symbol: 'x^n' },
    { label: '下標', symbol: 'x_n' },
    { label: '上標', symbol: 'x^n' },
    
    // Calculus
    { label: '積分', symbol: '\\int_{a}^{b}' },
    { label: '不定積分', symbol: '\\int' },
    { label: '導數', symbol: '\\frac{d}{dx}' },
    { label: '偏導數', symbol: '\\frac{\\partial}{\\partial x}' },
    { label: '極限', symbol: '\\lim_{x \\to a}' },
    { label: '微分', symbol: 'dx' },
    
    // Summation and Products
    { label: '求和', symbol: '\\sum_{i=1}^{n}' },
    { label: '連乘', symbol: '\\prod_{i=1}^{n}' },
    { label: '無限求和', symbol: '\\sum_{i=1}^{\\infty}' },
    
    // Greek Letters
    { label: 'α', symbol: '\\alpha' },
    { label: 'β', symbol: '\\beta' },
    { label: 'γ', symbol: '\\gamma' },
    { label: 'δ', symbol: '\\delta' },
    { label: 'ε', symbol: '\\epsilon' },
    { label: 'ζ', symbol: '\\zeta' },
    { label: 'η', symbol: '\\eta' },
    { label: 'θ', symbol: '\\theta' },
    { label: 'ι', symbol: '\\iota' },
    { label: 'κ', symbol: '\\kappa' },
    { label: 'λ', symbol: '\\lambda' },
    { label: 'μ', symbol: '\\mu' },
    { label: 'ν', symbol: '\\nu' },
    { label: 'ξ', symbol: '\\xi' },
    { label: 'π', symbol: '\\pi' },
    { label: 'ρ', symbol: '\\rho' },
    { label: 'σ', symbol: '\\sigma' },
    { label: 'τ', symbol: '\\tau' },
    { label: 'υ', symbol: '\\upsilon' },
    { label: 'φ', symbol: '\\phi' },
    { label: 'χ', symbol: '\\chi' },
    { label: 'ψ', symbol: '\\psi' },
    { label: 'ω', symbol: '\\omega' },
    
    // Capital Greek Letters
    { label: 'Α', symbol: '\\Alpha' },
    { label: 'Β', symbol: '\\Beta' },
    { label: 'Γ', symbol: '\\Gamma' },
    { label: 'Δ', symbol: '\\Delta' },
    { label: 'Ε', symbol: '\\Epsilon' },
    { label: 'Ζ', symbol: '\\Zeta' },
    { label: 'Η', symbol: '\\Eta' },
    { label: 'Θ', symbol: '\\Theta' },
    { label: 'Ι', symbol: '\\Iota' },
    { label: 'Κ', symbol: '\\Kappa' },
    { label: 'Λ', symbol: '\\Lambda' },
    { label: 'Μ', symbol: '\\Mu' },
    { label: 'Ν', symbol: '\\Nu' },
    { label: 'Ξ', symbol: '\\Xi' },
    { label: 'Π', symbol: '\\Pi' },
    { label: 'Ρ', symbol: '\\Rho' },
    { label: 'Σ', symbol: '\\Sigma' },
    { label: 'Τ', symbol: '\\Tau' },
    { label: 'Υ', symbol: '\\Upsilon' },
    { label: 'Φ', symbol: '\\Phi' },
    { label: 'Χ', symbol: '\\Chi' },
    { label: 'Ψ', symbol: '\\Psi' },
    { label: 'Ω', symbol: '\\Omega' },
    
    // Set Theory
    { label: '屬於', symbol: '\\in' },
    { label: '不屬於', symbol: '\\notin' },
    { label: '包含', symbol: '\\subset' },
    { label: '包含於', symbol: '\\supset' },
    { label: '真包含', symbol: '\\subsetneq' },
    { label: '交集', symbol: '\\cap' },
    { label: '聯集', symbol: '\\cup' },
    { label: '空集', symbol: '\\emptyset' },
    { label: '全集', symbol: '\\mathbb{U}' },
    
    // Logic
    { label: '且', symbol: '\\land' },
    { label: '或', symbol: '\\lor' },
    { label: '非', symbol: '\\neg' },
    { label: '蘊含', symbol: '\\implies' },
    { label: '等價', symbol: '\\iff' },
    { label: '存在', symbol: '\\exists' },
    { label: '任意', symbol: '\\forall' },
    
    // Arrows
    { label: '箭頭', symbol: '\\rightarrow' },
    { label: '左箭頭', symbol: '\\leftarrow' },
    { label: '雙箭頭', symbol: '\\leftrightarrow' },
    { label: '長箭頭', symbol: '\\longrightarrow' },
    { label: '映射', symbol: '\\mapsto' },
    
    // Functions
    { label: '函數', symbol: 'f(x)' },
    { label: '複合函數', symbol: 'f \\circ g' },
    { label: '反函數', symbol: 'f^{-1}' },
    { label: '極限函數', symbol: '\\lim_{x \\to a} f(x)' },
    
    // Matrices
    { label: '矩陣', symbol: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: '行列式', symbol: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}' },
    { label: '向量', symbol: '\\vec{v}' },
    
    // Special Functions
    { label: 'sin', symbol: '\\sin' },
    { label: 'cos', symbol: '\\cos' },
    { label: 'tan', symbol: '\\tan' },
    { label: 'log', symbol: '\\log' },
    { label: 'ln', symbol: '\\ln' },
    { label: 'exp', symbol: '\\exp' },
    { label: 'abs', symbol: '|x|' },
    { label: '階乘', symbol: 'n!' },
    
    // Infinity and Numbers
    { label: '無限', symbol: '\\infty' },
    { label: '虛數', symbol: 'i' },
    { label: '自然數', symbol: '\\mathbb{N}' },
    { label: '整數', symbol: '\\mathbb{Z}' },
    { label: '有理數', symbol: '\\mathbb{Q}' },
    { label: '實數', symbol: '\\mathbb{R}' },
    { label: '複數', symbol: '\\mathbb{C}' },
    
    // Brackets and Parentheses
    { label: '圓括號', symbol: '()' },
    { label: '方括號', symbol: '[]' },
    { label: '大括號', symbol: '\\{\\}' },
    { label: '尖括號', symbol: '\\langle \\rangle' },
    { label: '絕對值', symbol: '|x|' },
    { label: '天花板', symbol: '\\lceil x \\rceil' },
    { label: '地板', symbol: '\\lfloor x \\rfloor' },
    
    // Dots and Ellipsis
    { label: '點', symbol: '\\cdot' },
    { label: '省略號', symbol: '\\cdots' },
    { label: '垂直省略', symbol: '\\vdots' },
    { label: '對角省略', symbol: '\\ddots' },
    
    // Other Symbols
    { label: '度', symbol: '^{\\circ}' },
    { label: '百分號', symbol: '\\%' },
    { label: '度數', symbol: '^{\\prime}' },
    { label: '秒數', symbol: '^{\\prime\\prime}' },
    { label: '角度', symbol: '\\angle' },
    { label: '垂直', symbol: '\\perp' },
    { label: '平行', symbol: '\\parallel' },
    { label: '相似', symbol: '\\sim' },
    { label: '全等', symbol: '\\cong' },
    { label: '約等於', symbol: '\\approx' },
    { label: '正比', symbol: '\\propto' },
    { label: '梯度', symbol: '\\nabla' },
    { label: '拉普拉斯', symbol: '\\Delta' },
    { label: '偏微分', symbol: '\\partial' },
  ];

  // Filter symbols based on search term
  const filteredSymbols = commonSymbols.filter(symbol => 
    symbol.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    symbol.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while MathQuill is loading
  if (!isClient || !MathQuill) {
    return (
      <div className={`bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative ${className}`}>
        <div className="w-full h-16 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl p-2 border-6 border-gray-500 relative overflow-visible ${className}`}>
      {/* MathQuill Input Field */}
      <div className="relative" ref={containerRef}>
        <MathQuill.EditableMathField
          latex={mathValue}
          onChange={handleMathChange}
          className="w-full bg-transparent text-gray-600 placeholder-gray-400 
          resize-none outline-none text-sm leading-relaxed min-h-[40px] pr-12 border-none text-center"
        />
        
        {/* Math Symbols Button */}
        <button
          type="button"
          onClick={() => setShowSymbols(!showSymbols)}
          className="absolute top-2 
          border-blue-300 border-2 right-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
        >
          f(x)
        </button>
      </div>

      {/* Math Symbols Panel */}
      {showSymbols && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg p-2 z-50 max-h-64 w-full">
          <div className="flex justify-between items-center mb-2 flex-shrink-0">
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
          
          {/* Search Bar */}
          <div className="mb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="搜尋符號..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A9CEB] focus:border-transparent"
              />
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-52 pr-1">
            <div className="grid grid-cols-4 gap-1">
              {filteredSymbols.map((item, index) => (
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