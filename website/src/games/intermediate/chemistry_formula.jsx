import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "sulfuric-acid",
    title: "Molecular Formula - Sulfuric Acid",
    question: "Input the molecular formula of sulfuric acid.",
    type: "molecular-formula",
    answer: "H2SO4",
    alternativeAnswers: ["H₂SO₄"],
    hint: "Sulfuric acid contains hydrogen, sulfur, and oxygen. It has 2 hydrogen atoms, 1 sulfur atom, and 4 oxygen atoms.",
    description: "A strong acid commonly used in car batteries and industrial processes."
  },
  {
    id: "sodium-chloride",
    title: "Molecular Formula - Table Salt",
    question: "What is the molecular formula of sodium chloride (table salt)?",
    type: "molecular-formula",
    answer: "NaCl",
    alternativeAnswers: ["nacl"],
    hint: "Sodium chloride is made of sodium (Na) and chlorine (Cl) in a 1:1 ratio.",
    description: "The most common salt used in cooking and food preservation."
  },
  {
    id: "glucose",
    title: "Molecular Formula - Glucose",
    question: "Enter the molecular formula for glucose (blood sugar).",
    type: "molecular-formula",
    answer: "C6H12O6",
    alternativeAnswers: ["C₆H₁₂O₆"],
    hint: "Glucose has 6 carbon atoms, 12 hydrogen atoms, and 6 oxygen atoms. It's a simple sugar.",
    description: "A simple sugar that serves as the primary source of energy for cells."
  },
  {
    id: "methane",
    title: "Molecular Formula - Natural Gas",
    question: "What is the molecular formula of methane (natural gas)?",
    type: "molecular-formula",
    answer: "CH4",
    alternativeAnswers: ["CH₄"],
    hint: "Methane has 1 carbon atom bonded to 4 hydrogen atoms.",
    description: "The main component of natural gas, used for heating and cooking."
  },
  {
    id: "calcium-carbonate",
    title: "Molecular Formula - Limestone",
    question: "Input the molecular formula of calcium carbonate (limestone).",
    type: "molecular-formula",
    answer: "CaCO3",
    alternativeAnswers: ["CaCO₃"],
    hint: "Contains calcium (Ca), carbon (C), and oxygen (O). The carbonate ion is CO₃²⁻.",
    description: "Found in limestone, marble, and chalk. Also present in eggshells and seashells."
  },
  {
    id: "ammonia",
    title: "Molecular Formula - Ammonia",
    question: "What is the molecular formula of ammonia gas?",
    type: "molecular-formula",
    answer: "NH3",
    alternativeAnswers: ["NH₃"],
    hint: "Ammonia contains nitrogen and hydrogen. One nitrogen atom bonded to three hydrogen atoms.",
    description: "A pungent gas used in fertilizers and cleaning products."
  },
  {
    id: "carbon-dioxide",
    title: "Molecular Formula - Greenhouse Gas",
    question: "Enter the molecular formula for carbon dioxide.",
    type: "molecular-formula",
    answer: "CO2",
    alternativeAnswers: ["CO₂"],
    hint: "Carbon dioxide has one carbon atom and two oxygen atoms.",
    description: "A greenhouse gas produced by respiration and combustion of fossil fuels."
  },
  {
    id: "hydrogen-peroxide",
    title: "Molecular Formula - Disinfectant",
    question: "What is the molecular formula of hydrogen peroxide?",
    type: "molecular-formula",
    answer: "H2O2",
    alternativeAnswers: ["H₂O₂"],
    hint: "Similar to water but with an extra oxygen atom. Contains 2 hydrogen and 2 oxygen atoms.",
    description: "A common disinfectant and bleaching agent."
  },
  {
    id: "ethanol",
    title: "Molecular Formula - Alcohol",
    question: "Input the molecular formula of ethanol (drinking alcohol).",
    type: "molecular-formula",
    answer: "C2H6O",
    alternativeAnswers: ["C₂H₆O", "C2H5OH", "C₂H₅OH"],
    hint: "Ethanol has 2 carbon atoms, 6 hydrogen atoms, and 1 oxygen atom. Can also be written as C₂H₅OH.",
    description: "The type of alcohol found in alcoholic beverages."
  },
  {
    id: "sodium-hydroxide",
    title: "Molecular Formula - Caustic Soda",
    question: "What is the molecular formula of sodium hydroxide (lye)?",
    type: "molecular-formula",
    answer: "NaOH",
    alternativeAnswers: ["naoh"],
    hint: "Contains sodium (Na), oxygen (O), and hydrogen (H). It's a strong base.",
    description: "A strong base used in soap making and drain cleaners."
  },
  {
    id: "acetic-acid",
    title: "Molecular Formula - Vinegar",
    question: "Enter the molecular formula for acetic acid (vinegar).",
    type: "molecular-formula",
    answer: "CH3COOH",
    alternativeAnswers: ["C2H4O2", "C₂H₄O₂", "CH₃COOH"],
    hint: "Can be written as CH₃COOH or C₂H₄O₂. Contains 2 carbons, 4 hydrogens, and 2 oxygens.",
    description: "The acid that gives vinegar its sour taste and smell."
  },
  {
    id: "aspirin",
    title: "Molecular Formula - Pain Reliever",
    question: "What is the molecular formula of aspirin?",
    type: "molecular-formula",
    answer: "C9H8O4",
    alternativeAnswers: ["C₉H₈O₄"],
    hint: "Aspirin has 9 carbon atoms, 8 hydrogen atoms, and 4 oxygen atoms.",
    description: "A common pain reliever and anti-inflammatory medication."
  }
];

export default function ChemistryFormulaGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setUserAnswer("");
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
    setAttempts(0);
  }, [currentProblem]);

  const checkAnswer = () => {
    const normalizedUserAnswer = normalizeFormula(userAnswer.trim());
    const normalizedCorrectAnswer = normalizeFormula(currentProblem.answer);
    
    // Check main answer
    let isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    
    // Check alternative answers
    if (!isCorrect && currentProblem.alternativeAnswers) {
      isCorrect = currentProblem.alternativeAnswers.some(alt => 
        normalizeFormula(alt) === normalizedUserAnswer
      );
    }

    setAttempts(prev => prev + 1);

    if (isCorrect) {
      setIsComplete(true);
      setFeedback({ 
        status: 'correct', 
        message: 'Excellent! Your formula is correct.',
        userFormula: userAnswer.trim(),
        correctFormula: currentProblem.answer
      });
      toast.success("Correct formula!");
    } else if (userAnswer.trim() === '') {
      setFeedback({ 
        status: 'empty', 
        message: 'Please enter a chemical formula.',
        userFormula: '',
        correctFormula: currentProblem.answer
      });
    } else {
      setFeedback({ 
        status: 'incorrect', 
        message: `Incorrect. You entered: ${userAnswer.trim()}`,
        userFormula: userAnswer.trim(),
        correctFormula: currentProblem.answer
      });
      toast.error("Incorrect formula. Try again!");
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

  const clearAnswer = () => {
    setUserAnswer("");
    setFeedback({});
    setIsComplete(false);
  };

  const showAnswer = () => {
    setUserAnswer(currentProblem.answer);
    setFeedback({ 
      status: 'revealed', 
      message: 'Answer revealed!',
      userFormula: currentProblem.answer,
      correctFormula: currentProblem.answer
    });
    toast.info("Answer revealed!");
  };

  const getRandomProblem = () => {
    const availableProblems = SAMPLE_PROBLEMS.filter(p => p.id !== currentProblem.id);
    const randomProblem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    setCurrentProblem(randomProblem);
  };

  const getFeedbackColor = () => {
    switch (feedback.status) {
      case 'correct': return 'text-green-600 border-green-200 bg-green-50';
      case 'incorrect': return 'text-red-600 border-red-200 bg-red-50';
      case 'empty': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'revealed': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-gray-600';
    }
  };

  const getInputBorderColor = () => {
    if (feedback.status === 'correct') return 'border-green-500 bg-green-50';
    if (feedback.status === 'incorrect') return 'border-red-500 bg-red-50';
    return 'border-purple-300 bg-white';
  };

  const formatFormulaDisplay = (formula) => {
    return formula.replace(/(\d+)/g, '�$1')
      .replace(/₁/g, '₁')
      .replace(/₂/g, '₂')
      .replace(/₃/g, '₃')
      .replace(/₄/g, '₄')
      .replace(/₅/g, '₅')
      .replace(/₆/g, '₆')
      .replace(/₇/g, '₇')
      .replace(/₈/g, '₈')
      .replace(/₉/g, '₉')
      .replace(/₀/g, '₀');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Chemistry Formula</h1>
            <p className="mt-2 text-gray-600">
              Input complete chemical formulas for various compounds and molecules.
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
                className="w-full rounded border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-700 outline-none focus:border-purple-500 focus:bg-white mb-2"
              >
                {SAMPLE_PROBLEMS.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </select>
              <button
                onClick={getRandomProblem}
                className="w-full px-3 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium hover:bg-purple-200 transition"
              >
                Random Problem
              </button>
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attempts:</span>
                  <span className="text-sm font-medium text-purple-700">{attempts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${
                    isComplete ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {isComplete ? 'Complete ✓' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={checkAnswer}
                  className="w-full px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition"
                >
                  Check Answer
                </button>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  onClick={clearAnswer}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Clear Answer
                </button>
                <button
                  onClick={showAnswer}
                  className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                >
                  Show Answer
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
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Format Guide</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Use capital letters for elements (H, O, C)</div>
                <div>• Use numbers for subscripts (H2O, CO2)</div>
                <div>• Or use subscript symbols (H₂O, CO₂)</div>
                <div>• Examples: NaCl, CH4, CaCO3</div>
              </div>
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read the compound description</li>
                <li>• Enter the complete molecular formula</li>
                <li>• Use proper capitalization</li>
                <li>• Include all subscript numbers</li>
                <li>• Click "Check Answer" to validate</li>
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
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <div className="text-xl font-medium text-gray-800 mb-3">
                {currentProblem.question}
              </div>
              <div className="text-sm text-gray-600">
                {currentProblem.description}
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="text-sm font-semibold text-purple-700 mb-3">Enter Your Answer:</h4>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                className={`w-full px-4 py-3 text-xl font-mono border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 ${getInputBorderColor()}`}
                placeholder="Enter chemical formula (e.g., H2SO4)"
              />
              <div className="mt-2 text-sm text-gray-500">
                Press Enter or click "Check Answer" to submit
              </div>
            </div>
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div className={`border rounded-xl p-4 ${getFeedbackColor()}`}>
              <h4 className="text-sm font-semibold mb-2">
                {feedback.status === 'correct' && '✓ Correct!'}
                {feedback.status === 'incorrect' && '✗ Incorrect'}
                {feedback.status === 'empty' && '⚠ Empty'}
                {feedback.status === 'revealed' && 'ℹ Answer Revealed'}
              </h4>
              <p className="text-sm mb-2">{feedback.message}</p>
              {feedback.userFormula && feedback.status !== 'empty' && (
                <div className="text-sm">
                  <div>Your answer: <span className="font-mono">{formatFormulaDisplay(feedback.userFormula)}</span></div>
                  {feedback.status === 'incorrect' && (
                    <div>Correct answer: <span className="font-mono">{formatFormulaDisplay(feedback.correctFormula)}</span></div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Alternative Answers */}
          {currentProblem.alternativeAnswers && currentProblem.alternativeAnswers.length > 0 && (
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Accepted Answer Formats:</h4>
              <div className="text-sm text-blue-600">
                <div className="font-mono">{formatFormulaDisplay(currentProblem.answer)}</div>
                {currentProblem.alternativeAnswers.map((alt, index) => (
                  <div key={index} className="font-mono">{formatFormulaDisplay(alt)}</div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {isComplete && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Excellent work!</h4>
              <p className="text-sm text-green-600">
                You correctly identified the molecular formula for {currentProblem.title.split(' - ')[1]}! 
                Understanding chemical formulas is essential for chemistry. Try another compound to practice more!
              </p>
            </div>
          )}

          {/* Common Chemical Formulas Reference */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Common Chemical Formulas Reference:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">H₂O</div>
                <div className="text-gray-600">Water</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">CO₂</div>
                <div className="text-gray-600">Carbon Dioxide</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">NaCl</div>
                <div className="text-gray-600">Salt</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">CH₄</div>
                <div className="text-gray-600">Methane</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">NH₃</div>
                <div className="text-gray-600">Ammonia</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-mono font-semibold">C₆H₁₂O₆</div>
                <div className="text-gray-600">Glucose</div>
              </div>
            </div>
          </div>

          {/* Chemistry Tips */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Formula Writing Tips:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Element Symbols:</strong> Use proper capitalization (Na, not na; Cl, not CL)</p>
              <p><strong>Subscripts:</strong> Numbers after elements show how many atoms (H₂O = 2 hydrogen, 1 oxygen)</p>
              <p><strong>No Subscript = 1:</strong> If no number appears, assume 1 atom (H₂O has 1 oxygen)</p>
              <p><strong>Order Matters:</strong> Write positive ions first, then negative ions (NaCl, not ClNa)</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}