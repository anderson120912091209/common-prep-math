'use client'

import { useState } from 'react';

interface MathQuestionProps {
  isLandingPage?: boolean;
}

export default function MathQuestion({ isLandingPage = false }: MathQuestionProps) {
  const [showMathSymbols, setShowMathSymbols] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [activeAnswer, setActiveAnswer] = useState(1);
  const [selectedOption1, setSelectedOption1] = useState<number | null>(null);
  const [selectedOption2, setSelectedOption2] = useState<number | null>(null);
  const [showResult1, setShowResult1] = useState(false);
  const [showResult2, setShowResult2] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');
  
  // Define correct answers (can be changed as needed)
  const correctAnswer1 = 4 as number; // Option (4) for question 1
  const correctAnswer2 = 2 as number; // Option (2) for question 2

  const handleOptionClick = (questionNumber: number, optionNumber: number) => {
    if (questionNumber === 1) {
      setSelectedOption1(optionNumber);
    } else {
      setSelectedOption2(optionNumber);
    }
  };

  const handleSubmit = (questionNumber: number) => {
    const selectedOption = questionNumber === 1 ? selectedOption1 : selectedOption2;
    const correctAnswer = questionNumber === 1 ? correctAnswer1 : correctAnswer2;
    
    if (selectedOption === null) return;
    
    if (selectedOption === correctAnswer) {
      // Correct answer - show celebration
      setCelebrationText('正確！');
      setShowCelebration(true);
      
      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      
      if (questionNumber === 1) {
        setShowResult1(true);
      } else {
        setShowResult2(true);
      }
    } else {
      // Wrong answer - just show result
      if (questionNumber === 1) {
        setShowResult1(true);
        // Reset after 3 seconds
        setTimeout(() => {
          setShowResult1(false);
          setSelectedOption1(null);
        }, 3000);
      } else {
        setShowResult2(true);
        // Reset after 3 seconds
        setTimeout(() => {
          setShowResult2(false);
          setSelectedOption2(null);
        }, 3000);
      }
    }
  };

  const getOptionClassName = (questionNumber: number, optionNumber: number) => {
    const isSelected = questionNumber === 1 ? selectedOption1 === optionNumber : selectedOption2 === optionNumber;
    const showResult = questionNumber === 1 ? showResult1 : showResult2;
    const correctAnswer = questionNumber === 1 ? correctAnswer1 : correctAnswer2;
    
    let baseClasses = "bg-gray-50 px-2 py-1 rounded-full text-center cursor-pointer transition-colors duration-200";
    
    if (isSelected) {
      if (showResult) {
        if (optionNumber === correctAnswer) {
          baseClasses += " bg-green-200 text-green-800 border-2 border-green-400";
        } else {
          baseClasses += " bg-red-200 text-red-800 border-2 border-red-400";
        }
      } else {
        baseClasses += " bg-blue-200 text-blue-800 border-2 border-blue-400";
      }
    }
    
    return baseClasses;
  };

  const insertSymbol = (symbol: string) => {
    // Check which textarea is currently focused in the DOM
    const activeElement = document.activeElement;
    const answer1Element = document.getElementById('answer1-textarea');
    const answer2Element = document.getElementById('answer2-textarea');
    
    if (activeElement === answer1Element) {
      setAnswer1(prev => prev + symbol);
      setActiveAnswer(1); // Update active answer based on focus
    } else if (activeElement === answer2Element) {
      setAnswer2(prev => prev + symbol);
      setActiveAnswer(2); // Update active answer based on focus
    } else {
      // Fallback to the last known active answer
      if (activeAnswer === 1) {
        setAnswer1(prev => prev + symbol);
      } else {
        setAnswer2(prev => prev + symbol);
      }
    }
    setShowMathSymbols(false);
  };

  const getPopupPosition = () => {
    // Check current focus when popup is being positioned
    const activeElement = document.activeElement;
    const answer1Element = document.getElementById('answer1-textarea');
    const answer2Element = document.getElementById('answer2-textarea');
    
    if (activeElement === answer1Element) {
      return 'top-48';
    } else if (activeElement === answer2Element) {
      return 'top-96';
    } else {
      // Fallback to activeAnswer state
      return activeAnswer === 1 ? 'top-48' : 'top-96';
    }
  };
  return (
    <div className={isLandingPage ? "bg-white p-3" : "min-h-screen bg-white p-3"}>
      <div className="max-w-5xl mx-auto relative">
        {/* Main Question Card */}
        <div className="bg-white rounded-3xl border-solid border-black overflow-hidden flex flex-col" style={{borderWidth: '12px', height: isLandingPage ? '600px' : '90vh', width: isLandingPage ? '750px' : 'auto'}}>
          {/* Top Title */}
          <div className="px-8 py-4 flex-shrink-0">
          </div>
          
          {/* Filter Controls */}
          <div className="px-6 pb-3 flex-shrink-0">
            <div className="flex items-center justify-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                <button className="flex items-center gap-1.5 bg-blue-300 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                  </svg>
                  List
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2"/>
                    <path d="M12 6a6 6 6 0 0 0-6 6 6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0-6-6z"/>
                  </svg>
                  Single
                </button>
              </div>
              
              {/* Paper Selection */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                <button className="text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">卷一</button>
                <button className="text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">卷二</button>
                <button className="text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">卷三</button>
                <button className="bg-blue-300 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap">混合</button>
              </div>
              
              {/* Level Selection */}
              <div className="flex bg-white border-2 border-gray-300 rounded-xl p-1">
                <button className="text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">歷年題庫</button>
                <button className="text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-50 transition-all whitespace-nowrap">模擬題</button>
                <button className="bg-blue-300 text-blue-900 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap">混合</button>
              </div>
            </div>
          </div>
          
          {/* Content Container */}
          <div className="flex-1 mx-6 mb-6 bg-white rounded-2xl border-2 border-gray-300 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">數學A 模擬試卷</h1>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">數A卷</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">試卷 1</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Calculator Icon */}
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                    <line x1="8" y1="6" x2="16" y2="6"/>
                    <line x1="8" y1="10" x2="16" y2="10"/>
                    <line x1="8" y1="14" x2="16" y2="14"/>
                    <line x1="8" y1="18" x2="10" y2="18"/>
                    <line x1="14" y1="18" x2="16" y2="18"/>
                  </svg>
                </button>
                
                {/* Check Icon */}
                <button className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                {/* Bookmark Icon */}
                <button className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center hover:bg-orange-200">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
                
                {/* Answer Button */}
                <button className="bg-blue-300 hover:bg-blue-400 text-blue-900 px-4 py-1 rounded-full font-medium text-sm">
                  解答
                </button>
                
                {/* Open Button */}
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded-full font-medium text-sm flex items-center gap-1">
                  <span>開啟</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
                
                {/* Menu Icon */}
                <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            </div>
            </div>
          
          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Question 1 */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-blue-400 font-bold text-sm leading-tight min-w-[20px]">1.</span>
                <div className="text-gray-800 text-sm leading-tight flex-1">
                  <p className="mb-3">
                    不透明袋中有藍、綠色球各若干顆，且球上皆有1或2的編號，其顆數如下表，例如標有1號的藍色球有2顆。
                  </p>
                  
                  {/* Table */}
                  <div className="mb-4 flex justify-center">
                    <table className="border-collapse border border-gray-300 text-xs rounded-md overflow-hidden shadow-sm">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 bg-gray-100"></th>
                          <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">藍</th>
                          <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold">綠</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">1號</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">2</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">4</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">2號</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-italic">k</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mb-3">
                    從此袋中隨機抽取一球（每顆球被抽到的機率相等），若已知抽到藍色球的事件與抽到1號球的事件互相獨立，試問 <span className="font-italic">k</span> 值為何？
                  </p>
                  
                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div 
                      className={getOptionClassName(1, 1)}
                      onClick={() => handleOptionClick(1, 1)}
                    >
                      (1) 2
                      {selectedOption1 === 1 && showResult1 && (
                        <span className="ml-1">
                          {correctAnswer1 === 1 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(1, 2)}
                      onClick={() => handleOptionClick(1, 2)}
                    >
                      (2) 3
                      {selectedOption1 === 2 && showResult1 && (
                        <span className="ml-1">
                          {correctAnswer1 === 2 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(1, 3)}
                      onClick={() => handleOptionClick(1, 3)}
                    >
                      (3) 4
                      {selectedOption1 === 3 && showResult1 && (
                        <span className="ml-1">
                          {correctAnswer1 === 3 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(1, 4)}
                      onClick={() => handleOptionClick(1, 4)}
                    >
                      (4) 5
                      {selectedOption1 === 4 && showResult1 && (
                        <span className="ml-1">
                          {correctAnswer1 === 4 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(1, 5)}
                      onClick={() => handleOptionClick(1, 5)}
                    >
                      (5) 6
                      {selectedOption1 === 5 && showResult1 && (
                        <span className="ml-1">
                          {correctAnswer1 === 5 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Answer Area */}
              <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative">
                <textarea 
                  id="answer1-textarea"
                  className="w-full bg-transparent text-gray-600 placeholder-gray-400 resize-none outline-none text-sm leading-relaxed"
                  placeholder="在此寫下您的答案..."
                  rows={2}
                  value={answer1}
                  onChange={(e) => setAnswer1(e.target.value)}
                  onFocus={() => setActiveAnswer(1)}
                />
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center justify-between">
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
                  <button 
                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700"
                    onClick={() => {
                      // Update activeAnswer based on current focus before opening popup
                      const activeElement = document.activeElement;
                      const answer1Element = document.getElementById('answer1-textarea');
                      const answer2Element = document.getElementById('answer2-textarea');
                      
                      if (activeElement === answer1Element) {
                        setActiveAnswer(1);
                      } else if (activeElement === answer2Element) {
                        setActiveAnswer(2);
                      }
                      
                      setShowMathSymbols(true);
                    }}
                  >
                    <span className="font-mono text-xs">fx</span>
                    數學
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="16,18 22,12 16,6"/>
                      <polyline points="8,6 2,12 8,18"/>
                    </svg>
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
                  <button 
                    onClick={() => handleSubmit(1)}
                    disabled={selectedOption1 === null}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 ${
                      selectedOption1 === null 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}
                  >
                    評分答案
                    <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                    </svg>
                    <span className="bg-white px-1 py-0.5 rounded-full text-xs font-bold">1</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-blue-400 font-bold text-sm leading-tight min-w-[20px]">2.</span>
                <div className="text-gray-800 text-sm leading-tight flex-1">
                  <p className="mb-3">
                    坐標平面上，<span className="font-italic">P(a,0)</span> 為 <span className="font-italic">x</span> 軸上一點，其中 <span className="font-italic">a</span> &gt; 0。令 <span className="font-italic">L₁</span>、<span className="font-italic">L₂</span> 為通過 <span className="font-italic">P</span> 點，斜率分別為 −
                    <span className="inline-flex flex-col items-center">
                      <span className="text-xs">4</span>
                      <span className="border-t border-gray-400 text-xs">3</span>
                    </span>、−
                    <span className="inline-flex flex-col items-center">
                      <span className="text-xs">3</span>
                      <span className="border-t border-gray-400 text-xs">2</span>
                    </span> 的直線。已知 <span className="font-italic">L₁</span>、<span className="font-italic">L₂</span> 分別與兩坐標軸圍成的兩個直角三角形的面積差為 3，試問 <span className="font-italic">a</span> 值為何？
                  </p>
                  
                  {/* Multiple Choice Options */}
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div 
                      className={getOptionClassName(2, 1)}
                      onClick={() => handleOptionClick(2, 1)}
                    >
                      (1) 3√2
                      {selectedOption2 === 1 && showResult2 && (
                        <span className="ml-1">
                          {correctAnswer2 === 1 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(2, 2)}
                      onClick={() => handleOptionClick(2, 2)}
                    >
                      (2) 6
                      {selectedOption2 === 2 && showResult2 && (
                        <span className="ml-1">
                          {correctAnswer2 === 2 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(2, 3)}
                      onClick={() => handleOptionClick(2, 3)}
                    >
                      (3) 6√2
                      {selectedOption2 === 3 && showResult2 && (
                        <span className="ml-1">
                          {correctAnswer2 === 3 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(2, 4)}
                      onClick={() => handleOptionClick(2, 4)}
                    >
                      (4) 9
                      {selectedOption2 === 4 && showResult2 && (
                        <span className="ml-1">
                          {correctAnswer2 === 4 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <div 
                      className={getOptionClassName(2, 5)}
                      onClick={() => handleOptionClick(2, 5)}
                    >
                      (5) 8√2
                      {selectedOption2 === 5 && showResult2 && (
                        <span className="ml-1">
                          {correctAnswer2 === 5 ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Answer Area */}
              <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative">
                <textarea 
                  id="answer2-textarea"
                  className="w-full bg-transparent text-gray-600 placeholder-gray-400 resize-none outline-none text-sm leading-relaxed"
                  placeholder="在此寫下您的答案..."
                  rows={2}
                  value={answer2}
                  onChange={(e) => setAnswer2(e.target.value)}
                  onFocus={() => setActiveAnswer(2)}
                />
              </div>
              
              {/* Toolbar */}
              <div className="flex items-center justify-between">
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
                  <button 
                    className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium text-gray-700"
                    onClick={() => {
                      // Update activeAnswer based on current focus before opening popup
                      const activeElement = document.activeElement;
                      const answer1Element = document.getElementById('answer1-textarea');
                      const answer2Element = document.getElementById('answer2-textarea');
                      
                      if (activeElement === answer1Element) {
                        setActiveAnswer(1);
                      } else if (activeElement === answer2Element) {
                        setActiveAnswer(2);
                      }
                      
                      setShowMathSymbols(true);
                    }}
                  >
                    <span className="font-mono text-xs">fx</span>
                    數學
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full">
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="16,18 22,12 16,6"/>
                      <polyline points="8,6 2,12 8,18"/>
                    </svg>
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
                  <button 
                    onClick={() => handleSubmit(2)}
                    disabled={selectedOption2 === null}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all duration-200 ${
                      selectedOption2 === null 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}
                  >
                    評分答案
                    <svg className="w-3 h-3 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                    </svg>
                    <span className="bg-white px-1 py-0.5 rounded-full text-xs font-bold">2</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Math Symbols Popup - Near Answer Area */}
        {showMathSymbols && (
          <div className={`absolute ${getPopupPosition()} right-4 bg-white rounded-xl border-2 border-gray-400 shadow-xl p-3 w-72 max-h-80 overflow-y-auto z-20`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-gray-900">數學符號</h3>
              <button 
                onClick={() => setShowMathSymbols(false)}
                className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Basic Operators */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">基本運算</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['+', '−', '×', '÷', '=', '≠'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comparison */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">比較符號</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['<', '>', '≤', '≥', '≈', '≡'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Powers & Roots */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">冪次與根號</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['²', '³', '⁴', '√', '∛', '^'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Greek Letters */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">希臘字母</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['α', 'β', 'γ', 'δ', 'θ', 'π'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-1 mt-1">
                  {['λ', 'μ', 'σ', 'φ', 'ω', 'Δ'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set Theory */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">集合論</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['∈', '∉', '⊆', '∪', '∩', '∅'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-1">進階符號</h4>
                <div className="grid grid-cols-6 gap-1">
                  {['∫', '∑', '∏', '∂', '∞', '∴'].map((symbol) => (
                    <button
                      key={symbol}
                      className="bg-gray-100 hover:bg-blue-200 border border-gray-400 rounded p-2 text-base font-mono text-center transition-colors text-gray-800 font-bold"
                      onClick={() => insertSymbol(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              點擊即可插入到答案框
            </div>
          </div>
        )}

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white border-2 border-green-300 text-green-700 px-8 py-6 rounded-xl shadow-lg animate-fade-in">
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2">{celebrationText}</div>
                <div className="text-sm text-gray-600 mb-3">答案正確！繼續加油</div>
                <div className="w-16 h-1 bg-green-400 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}