import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "balance-combustion",
    title: "Balance Combustion Equation",
    description: "Balance the chemical equation for the combustion of methane.",
    type: "equation-balancing",
    template: "{0}CH₄ + {1}O₂ → {2}CO₂ + {3}H₂O",
    answers: ["1", "2", "1", "2"],
    placeholders: ["coeff", "coeff", "coeff", "coeff"],
    hint: "Start by balancing carbon atoms, then hydrogen, and finally oxygen atoms."
  },
  {
    id: "complete-formula",
    title: "Complete Chemical Formula",
    description: "Fill in the missing chemical formulas in this acid-base reaction.",
    type: "formula-completion",
    template: "HCl + {0} → {1} + H₂O",
    answers: ["NaOH", "NaCl"],
    placeholders: ["formula", "formula"],
    hint: "This is a neutralization reaction between hydrochloric acid and a base to form salt and water."
  },
  {
    id: "balance-synthesis",
    title: "Balance Synthesis Reaction",
    description: "Balance the equation for the synthesis of ammonia (Haber process).",
    type: "equation-balancing",
    template: "{0}N₂ + {1}H₂ → {2}NH₃",
    answers: ["1", "3", "2"],
    placeholders: ["coeff", "coeff", "coeff"],
    hint: "Balance nitrogen first, then hydrogen. Each N₂ molecule provides 2 nitrogen atoms."
  },
  {
    id: "text-completion",
    title: "Chemistry Text Completion",
    description: "Complete the text about photosynthesis with the correct chemical formulas.",
    type: "text-completion",
    template: "Photosynthesis converts {0} and {1} into {2} and oxygen using sunlight. The balanced equation is: 6{0} + 6{1} → {2} + 6O₂",
    answers: ["CO₂", "H₂O", "C₆H₁₂O₆"],
    placeholders: ["formula", "formula", "formula"],
    hint: "Think about what plants take in (from air and soil) and what they produce (sugar and oxygen)."
  },
  {
    id: "ionic-equation",
    title: "Complete Ionic Equation",
    description: "Fill in the missing ions in this precipitation reaction.",
    type: "ionic-completion",
    template: "AgNO₃ + {0} → {1} + KNO₃",
    answers: ["KCl", "AgCl"],
    placeholders: ["formula", "formula"],
    hint: "Silver nitrate reacts with potassium chloride to form a white precipitate and potassium nitrate."
  },
  {
    id: "balance-decomposition",
    title: "Balance Decomposition Reaction",
    description: "Balance the thermal decomposition of calcium carbonate.",
    type: "equation-balancing",
    template: "{0}CaCO₃ → {1}CaO + {2}CO₂",
    answers: ["1", "1", "1"],
    placeholders: ["coeff", "coeff", "coeff"],
    hint: "This is a simple 1:1:1 ratio decomposition reaction."
  },
  {
    id: "redox-equation",
    title: "Complete Redox Equation",
    description: "Complete this redox reaction between zinc and copper sulfate.",
    type: "formula-completion",
    template: "Zn + {0} → {1} + Cu",
    answers: ["CuSO₄", "ZnSO₄"],
    placeholders: ["formula", "formula"],
    hint: "Zinc displaces copper from copper sulfate solution. Think about what compounds form."
  },
  {
    id: "molecular-formula",
    title: "Molecular Formula from Description",
    description: "Write the molecular formulas based on the chemical description.",
    type: "text-completion",
    template: "Table salt is {0}, water is {1}, and carbon dioxide is {2}. When {0} dissolves in {1}, it forms Na⁺ and Cl⁻ ions.",
    answers: ["NaCl", "H₂O", "CO₂"],
    placeholders: ["formula", "formula", "formula"],
    hint: "Think about the common names: table salt, water, and the gas we exhale."
  }
];

export default function CloseChemistryGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    setUserAnswers({});
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
  }, [currentProblem]);

  useEffect(() => {
    checkAnswers();
  }, [userAnswers]);

  const checkAnswers = () => {
    const newFeedback = {};
    let allCorrect = true;
    let allFilled = true;

    currentProblem.answers.forEach((correctAnswer, index) => {
      const userAnswer = userAnswers[index]?.trim();
      
      if (!userAnswer) {
        allFilled = false;
        return;
      }

      // Check if answer is correct (case insensitive, handle subscripts)
      const isCorrect = normalizeFormula(userAnswer) === normalizeFormula(correctAnswer);
      newFeedback[index] = isCorrect ? 'correct' : 'incorrect';
      
      if (!isCorrect) {
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allFilled && allCorrect) {
      setIsComplete(true);
      toast.success("Excellent! All chemical formulas are correct!");
    } else {
      setIsComplete(false);
    }
  };

  const normalizeFormula = (formula) => {
    return formula
      .toLowerCase()
      .replace(/₀/g, '0')
      .replace(/₁/g, '1')
      .replace(/₂/g, '2')
      .replace(/₃/g, '3')
      .replace(/₄/g, '4')
      .replace(/₅/g, '5')
      .replace(/₆/g, '6')
      .replace(/₇/g, '7')
      .replace(/₈/g, '8')
      .replace(/₉/g, '9')
      .replace(/\s/g, '');
  };

  const handleInputChange = (index, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const clearAnswers = () => {
    setUserAnswers({});
    setFeedback({});
    setIsComplete(false);
  };

  const showAnswers = () => {
    const answers = {};
    currentProblem.answers.forEach((answer, index) => {
      answers[index] = answer;
    });
    setUserAnswers(answers);
    toast.info("Answers revealed!");
  };

  const renderTemplate = () => {
    const parts = currentProblem.template.split(/(\{\d+\})/);
    
    return parts.map((part, index) => {
      const match = part.match(/\{(\d+)\}/);
      
      if (match) {
        const inputIndex = parseInt(match[1]);
        const value = userAnswers[inputIndex] || '';
        const placeholder = currentProblem.placeholders[inputIndex];
        const feedbackClass = feedback[inputIndex] === 'correct' 
          ? 'border-green-500 bg-green-50' 
          : feedback[inputIndex] === 'incorrect' 
          ? 'border-red-500 bg-red-50' 
          : 'border-purple-300 bg-white';

        const inputWidth = placeholder === 'coeff' ? '50px' : '80px';

        return (
          <input
            key={`input-${inputIndex}`}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(inputIndex, e.target.value)}
            className={`inline-block mx-1 px-2 py-1 text-center font-mono border-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-200 ${feedbackClass}`}
            style={{ width: inputWidth, minWidth: inputWidth }}
            placeholder={placeholder === 'coeff' ? '?' : 'Formula'}
          />
        );
      }
      
      return <span key={index} className="font-mono">{part}</span>;
    });
  };

  const getTypeDescription = () => {
    switch (currentProblem.type) {
      case 'equation-balancing':
        return 'Balance the chemical equation by adding coefficients';
      case 'formula-completion':
        return 'Complete the equation with the correct chemical formulas';
      case 'text-completion':
        return 'Fill in the chemical formulas in the text';
      case 'ionic-completion':
        return 'Complete the ionic equation with correct formulas';
      default:
        return 'Complete the chemical equation or text';
    }
  };

  const getScore = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.answers.length;
    return `${correctCount}/${totalCount}`;
  };

  const getScoreColor = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.answers.length;
    
    if (correctCount === totalCount && totalCount > 0) return 'text-green-600';
    if (correctCount > 0) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getInputTypeHelp = () => {
    const hasCoeff = currentProblem.placeholders.includes('coeff');
    const hasFormula = currentProblem.placeholders.includes('formula');
    
    return (
      <div className="text-sm text-gray-600 space-y-1">
        {hasCoeff && <div>• Coefficients: Enter numbers (1, 2, 3, etc.)</div>}
        {hasFormula && <div>• Formulas: Enter chemical formulas (H₂O, CO₂, etc.)</div>}
        <div>• Subscripts: You can use regular numbers (H2O) or subscripts (H₂O)</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Cloze Chemistry</h1>
            <p className="mt-2 text-gray-600">
              Complete chemical equations and text by filling in formulas and coefficients.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-purple-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-purple-700 mb-3">Select Problem</h2>
              <select
                value={currentProblem.id}
                onChange={(e) =>
                  setCurrentProblem(SAMPLE_PROBLEMS.find((p) => p.id === e.target.value))
                }
                className="w-full rounded border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-700 outline-none focus:border-purple-500 focus:bg-white"
              >
                {SAMPLE_PROBLEMS.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Problem Type</h3>
              <p className="text-sm text-gray-700 mb-3">{getTypeDescription()}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Score:</span>
                <span className={`text-sm font-medium ${getScoreColor()}`}>
                  {getScore()} correct
                </span>
              </div>
              
              {isComplete && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">✓ All correct!</p>
                </div>
              )}
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={clearAnswers}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Clear Answers
                </button>
                <button
                  onClick={showAnswers}
                  className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                >
                  Show Answers
                </button>
              </div>
            </div>

            {showHint && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Hint</h3>
                <p className="text-sm text-blue-600">{currentProblem.hint}</p>
              </div>
            )}

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Input Format</h3>
              {getInputTypeHelp()}
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read the description carefully</li>
                <li>• Fill in missing formulas or coefficients</li>
                <li>• Use proper chemical notation</li>
                <li>• Green border = correct answer</li>
                <li>• Red border = incorrect answer</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">
              {currentProblem.title}
            </h3>
            
            <p className="text-gray-600 mb-6">{currentProblem.description}</p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-xl leading-relaxed text-gray-800 text-center">
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* Answer Feedback */}
          {Object.keys(feedback).length > 0 && (
            <div className="border border-gray-200 bg-white rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Answer Feedback:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentProblem.answers.map((correctAnswer, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = feedback[index] === 'correct';
                  const hasAnswer = userAnswer && userAnswer.trim();
                  
                  if (!hasAnswer) return null;
                  
                  return (
                    <div key={index} className={`p-2 rounded border ${
                      isCorrect 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <span className="text-sm font-mono">
                        Position {index + 1}: {userAnswer} {isCorrect ? '✓' : '✗'}
                      </span>
                      {!isCorrect && (
                        <div className="text-xs mt-1 font-mono">
                          Correct answer: {correctAnswer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chemical Formula Reference */}
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-700 mb-3">Common Chemical Formulas Reference:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="font-mono">H₂O - Water</div>
              <div className="font-mono">CO₂ - Carbon dioxide</div>
              <div className="font-mono">NaCl - Salt</div>
              <div className="font-mono">CH₄ - Methane</div>
              <div className="font-mono">NH₃ - Ammonia</div>
              <div className="font-mono">HCl - Hydrochloric acid</div>
              <div className="font-mono">NaOH - Sodium hydroxide</div>
              <div className="font-mono">C₆H₁₂O₆ - Glucose</div>
            </div>
          </div>

          {/* Success Message */}
          {isComplete && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Excellent work!</h4>
              <p className="text-sm text-green-600">
                You've successfully completed the chemical equation! Understanding chemical formulas and 
                balancing equations is fundamental to chemistry. Try another problem to practice more reactions.
              </p>
            </div>
          )}

          {/* Chemistry Tips */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Chemistry Tips:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Balancing Equations:</strong> Start with the most complex molecule, balance atoms one at a time.</p>
              <p><strong>Formula Writing:</strong> Remember that elements have specific charges and combine accordingly.</p>
              <p><strong>Common Patterns:</strong> Combustion produces CO₂ + H₂O, neutralization produces salt + water.</p>
              <p><strong>Subscripts vs Coefficients:</strong> Subscripts are part of the formula, coefficients balance the equation.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}