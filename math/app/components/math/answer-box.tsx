import React from 'react'

const answerBox = () => { 


  return (
    <div className="bg-gray-50 rounded-2xl p-3 mb-3 border border-gray-100 relative">
       <textarea 
          id="answer1-textarea"
          className="w-full bg-transparent text-gray-600 placeholder-gray-400 resize-none outline-none text-sm leading-relaxed"
          placeholder="在此寫下您的答案..."
          rows={2}      
        />         
    </div>
  )
}

export default answerBox    