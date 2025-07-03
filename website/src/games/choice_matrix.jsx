import React, { useState } from "react";

const questions = [
  "The sky is blue.",
  "Cats can fly.",
  "Water boils at 100°C.",
  "The earth is flat.",
  "West Bengal is a country.",
  "The sun rises in the east.", 
  "Fish can breathe underwater.",
  "Mount Everest is the tallest mountain.",
];

function ChoiceMatrix() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleSelect = (idx, value) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[idx] = value;
      return updated;
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white-100 rounded-xl shadow-lg p-8 border border-purple-500">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Choice Matrix
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 text-purple-700 text-lg">Statement</th>
              <th className="py-2 px-4 text-purple-700 text-lg text-center">
                True
              </th>
              <th className="py-2 px-4 text-purple-700 text-lg text-center">
                False
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={idx} className="border-b border-purple-100">
                <td className="py-3 px-4 text-black">{q}</td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="radio"
                    id={`true-${idx}`}
                    name={`choice-${idx}`}
                    checked={answers[idx] === true}
                    onChange={() => handleSelect(idx, true)}
                    className="accent-purple-500 w-5 h-5"
                  />
                </td>
                <td className="py-3 px-4 text-center">
                  <input
                    type="radio"
                    id={`false-${idx}`}
                    name={`choice-${idx}`}
                    checked={answers[idx] === false}
                    onChange={() => handleSelect(idx, false)}
                    className="accent-yellow-500 w-5 h-5"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ChoiceMatrix;
