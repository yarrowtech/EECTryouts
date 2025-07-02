import React, { useState } from "react";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 1,
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Jane Austen"],
    answer: 0,
  },
];

const optionLabels = ['A', 'B', 'C', 'D'];

function MCQ() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);

  const handleOptionClick = (idx) => {
    setSelected(idx);
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(null);
  };

  const q = questions[current];

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white-100 rounded-xl shadow-lg p-8 border border-purple-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">MCQ</h2>
      <div className="mb-4">
        <span className="text-lg font-medium text-gray-700">Q{current + 1}:</span>
        <span className="ml-2 text-lg text-gray-600">{q.question}</span>
      </div>
      <div className="space-y-3 mb-6">
        {q.options.map((option, idx) => {
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
      <div className="flex justify-end">
        {current < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition-all disabled:opacity-50"          >
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
