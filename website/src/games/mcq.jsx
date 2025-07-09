import React, { useEffect, useState } from "react";

const optionLabels = ['A', 'B', 'C', 'D'];

function MCQ() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState('standard'); // 'radio' or 'button'
  const [questions, setQuestions] = useState([])

  const handleOptionClick = (idx) => {
    setSelected(idx);
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(null);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    setSelected(null);
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/mcq/fetch`)
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white-100 rounded-xl shadow-lg p-8 border border-purple-500">
      {/* Theme Switcher */}
      <div className="flex justify-end mb-4">
        <label className="mr-2 text-purple-700 font-medium">Theme:</label>
        <select value={theme} onChange={handleThemeChange} className="border border-purple-300 rounded px-2 py-1 focus:outline-none">
          <option value="standard">Standard</option>
          <option value="block">Block</option>
          <option value="radio">Radio Button</option>
        </select>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">MCQ</h2>
      <div className={`mb-4 w-full flex ${theme === 'radio' ? 'justify-center' : 'justify-start'} items-center`}>
        <span className="text-lg font-medium text-gray-700">Q{current + 1}:</span>
        <span className="ml-2 text-lg text-black">{questions[current]?.question}</span>
      </div>
      {theme === 'standard' ? (
        <ul className="space-y-3 mb-6 list-disc list-inside">
          {questions[current]?.options.map((option, idx) => {
            const isSelected = selected === idx;
            return (
              <li key={idx} className={`flex items-center ${isSelected ? 'bg-yellow-100' : ''} p-3 rounded-lg`}>
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name="mcq-option"
                  checked={isSelected}
                  onChange={() => handleOptionClick(idx)}
                  className="accent-purple-500 mr-3 w-5 h-5"
                />
                <label htmlFor={`option-${idx}`} className={`cursor-pointer text-lg ${isSelected ? 'font-semibold' : ''} text-black`}>{option}</label>
              </li>
            
            );
          })}
        </ul>
      ) :  theme === 'block' ? (
        <div className="space-y-3 mb-6">
          {questions[current]?.options.map((option, idx) => {
            const isSelected = selected === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={`w-full flex items-center text-left px-5 py-3 rounded-lg border transition-all duration-200 focus:outline-none
                  bg-gray-50 border-gray-200
                  ${isSelected ? 'bg-yellow-100 border-yellow-300 font-semibold' : 'hover:bg-purple-50 hover:border-purple-300'}
                `}
              >
                <span className="mr-4 font-bold">{optionLabels[idx]}.</span>
                {option}
              </button>
            );
          })}
        </div>
      ):(
        <ul className="space-y-3 mb-6 list-disc list-inside ou">
          {questions[current]?.options.map((option, idx) => {
            const isSelected = selected === idx;
            return (
              <li key={idx} className={`flex flex-col-reverse items-center ${isSelected ? 'bg-yellow-100' : ''} p-3 rounded-lg`}>
                <input
                  type="radio"
                  id={`option-${idx}`}
                  name="mcq-option"
                  checked={isSelected}
                  onChange={() => handleOptionClick(idx)}
                  className="accent-purple-500 mr-3 w-5 h-5"
                />
                <label htmlFor={`option-${idx}`} className={`cursor-pointer text-lg ${isSelected ? 'font-semibold' : ''} text-black`}>{option}</label>
              </li>
            
            );
          })}
        </ul>
      )}
      <div className="flex justify-end">
        {current < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all disabled:opacity-50"
          >
            Next
          </button>
        ) : selected !== null && (
          <span className="text-xl font-semibold text-purple-700"></span>
        )}
      </div>
    </div>
  );
}

export default MCQ;