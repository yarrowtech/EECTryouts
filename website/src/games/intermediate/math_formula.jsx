import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "algebra-equation",
    title: "Algebra - Complete the Equation",
    type: "equation",
    description: "Complete the equation so that both sides are equal.",
    template: "3x + {0} = {1} + x",
    acceptedAnswers: [
      { "0": "5", "1": "5" },
      { "0": "10", "1": "10" },
      { "0": "2", "1": "2" },
      { "0": "-3", "1": "-3" }
    ],
    hint: "Both sides need to have the same value. Try substituting different values for x."
  },
  {
    id: "units-conversion",
    title: "Math with Units - Distance Conversion",
    type: "units",
    description: "Complete the unit conversion equation.",
    template: "{0} meters = {1} centimeters",
    acceptedAnswers: [
      { "0": "1", "1": "100" },
      { "0": "2", "1": "200" },
      { "0": "0.5", "1": "50" },
      { "0": "3", "1": "300" }
    ],
    hint: "1 meter = 100 centimeters"
  },
  {
    id: "text-equation",
    title: "Math with Text - Word Equation",
    type: "text",
    description: "Complete the mathematical statement with words and numbers.",
    template: "If {0} plus {1} equals {2}, then {0} equals {3}",
    acceptedAnswers: [
      { "0": "5", "1": "3", "2": "8", "3": "5" },
      { "0": "x", "1": "7", "2": "12", "3": "5" },
      { "0": "a", "1": "b", "2": "c", "3": "c-b" }
    ],
    hint: "Think about basic algebra: if a + b = c, then a = c - b"
  },
  {
    id: "fraction-equation",
    title: "Math with Fractions - Equivalent Fractions",
    type: "fractions",
    description: "Complete the fraction equation to make equivalent fractions.",
    template: "{0}/{1} = {2}/8",
    acceptedAnswers: [
      { "0": "1", "1": "2", "2": "4" },
      { "0": "3", "1": "4", "2": "6" },
      { "0": "1", "1": "4", "2": "2" },
      { "0": "5", "1": "8", "2": "5" }
    ],
    hint: "Cross multiply to check: if a/b = c/d, then a×d = b×c"
  },
  {
    id: "matrix-addition",
    title: "Math with Matrices - Matrix Addition",
    type: "matrices", 
    description: "Complete the matrix addition equation.",
    template: "[{0} {1}] + [{2} {3}] = [5 7]",
    acceptedAnswers: [
      { "0": "2", "1": "3", "2": "3", "3": "4" },
      { "0": "1", "1": "2", "2": "4", "3": "5" },
      { "0": "0", "1": "1", "2": "5", "3": "6" }
    ],
    hint: "Add corresponding elements: first element + first element = 5, second element + second element = 7"
  },
  {
    id: "quadratic-blanks",
    title: "Fill in the Blanks - Quadratic Formula",
    type: "blanks",
    description: "Complete the quadratic formula.",
    template: "x = (-{0} ± √({0}² - {1}ac)) / {2}a",
    acceptedAnswers: [
      { "0": "b", "1": "4", "2": "2" }
    ],
    hint: "This is the standard quadratic formula: x = (-b ± √(b² - 4ac)) / 2a"
  },
  {
    id: "pythagorean-theorem",
    title: "Fill in the Blanks - Pythagorean Theorem",
    type: "blanks",
    description: "Complete the Pythagorean theorem.",
    template: "a² + {0}² = {1}²",
    acceptedAnswers: [
      { "0": "b", "1": "c" }
    ],
    hint: "In a right triangle, the sum of squares of the two shorter sides equals the square of the hypotenuse."
  },
  {
    id: "area-formula",
    title: "Math with Units - Area Formula",
    type: "units",
    description: "Complete the area formula with proper units.",
    template: "Area of rectangle = {0} × {1} = {2} square {3}",
    acceptedAnswers: [
      { "0": "5", "1": "3", "2": "15", "3": "meters" },
      { "0": "10", "1": "4", "2": "40", "3": "cm" },
      { "0": "length", "1": "width", "2": "area", "3": "units" }
    ],
    hint: "Area = length × width, and area units are always squared."
  }
];

export default function MathFormulaGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [validSolution, setValidSolution] = useState(null);

  useEffect(() => {
    setUserAnswers({});
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
    setValidSolution(null);
  }, [currentProblem]);

  useEffect(() => {
    checkAnswers();
  }, [userAnswers]);

  const checkAnswers = () => {
    if (Object.keys(userAnswers).length === 0) {
      setFeedback({});
      setIsComplete(false);
      return;
    }

    // Find matching solution from accepted answers
    const matchingSolution = currentProblem.acceptedAnswers.find(solution => {
      return Object.keys(solution).every(key => {
        const userAnswer = userAnswers[key]?.trim().toLowerCase();
        const correctAnswer = solution[key].toString().toLowerCase();
        return userAnswer === correctAnswer;
      });
    });

    if (matchingSolution) {
      // All answers match a valid solution
      const newFeedback = {};
      Object.keys(matchingSolution).forEach(key => {
        newFeedback[key] = 'correct';
      });
      setFeedback(newFeedback);
      setIsComplete(true);
      setValidSolution(matchingSolution);
      toast.success("Perfect! Your solution is correct!");
    } else {
      // Check individual answers for partial feedback
      const newFeedback = {};
      let hasAnyCorrect = false;

      Object.keys(userAnswers).forEach(key => {
        const userAnswer = userAnswers[key]?.trim().toLowerCase();
        if (!userAnswer) return;

        const isPartiallyCorrect = currentProblem.acceptedAnswers.some(solution => 
          solution[key] && solution[key].toString().toLowerCase() === userAnswer
        );

        if (isPartiallyCorrect) {
          newFeedback[key] = 'partial';
          hasAnyCorrect = true;
        } else {
          newFeedback[key] = 'incorrect';
        }
      });

      setFeedback(newFeedback);
      setIsComplete(false);
      setValidSolution(null);

      if (hasAnyCorrect) {
        toast.info("Some answers are correct! Keep working on the others.");
      }
    }
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
    setValidSolution(null);
  };

  const showSolution = () => {
    const firstSolution = currentProblem.acceptedAnswers[0];
    setUserAnswers(firstSolution);
    toast.info("Solution revealed!");
  };

  const getInputWidth = (content) => {
    // Dynamic width based on expected content
    if (content && content.length > 5) return '100px';
    if (content && content.length > 3) return '80px';
    return '60px';
  };

  const renderTemplate = () => {
    const parts = currentProblem.template.split(/(\{\d+\})/);
    
    return parts.map((part, index) => {
      const match = part.match(/\{(\d+)\}/);
      
      if (match) {
        const inputIndex = match[1];
        const value = userAnswers[inputIndex] || '';
        const feedbackType = feedback[inputIndex];
        
        let feedbackClass = 'border-purple-300 bg-white';
        if (feedbackType === 'correct') {
          feedbackClass = 'border-green-500 bg-green-50';
        } else if (feedbackType === 'partial') {
          feedbackClass = 'border-yellow-500 bg-yellow-50';
        } else if (feedbackType === 'incorrect') {
          feedbackClass = 'border-red-500 bg-red-50';
        }

        return (
          <input
            key={`input-${inputIndex}`}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(inputIndex, e.target.value)}
            className={`inline-block mx-1 px-2 py-1 text-center font-medium border-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-200 ${feedbackClass}`}
            style={{ width: getInputWidth(value), minWidth: '60px' }}
            placeholder="?"
          />
        );
      }
      
      return <span key={index} className="whitespace-pre">{part}</span>;
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'equation': return '🔢';
      case 'units': return '📏';
      case 'text': return '📝';
      case 'fractions': return '➗';
      case 'matrices': return '🔲';
      case 'blanks': return '📋';
      default: return '🧮';
    }
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'equation': return 'bg-blue-100 text-blue-700';
      case 'units': return 'bg-green-100 text-green-700';
      case 'text': return 'bg-purple-100 text-purple-700';
      case 'fractions': return 'bg-orange-100 text-orange-700';
      case 'matrices': return 'bg-red-100 text-red-700';
      case 'blanks': return 'bg-gray-100 text-gray-700';
      default: return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Math Formula</h1>
            <p className="mt-2 text-gray-600">
              Complete mathematical equations and formulas with various input types.
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
                    {getTypeIcon(problem.type)} {problem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-purple-700">Problem Type</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(currentProblem.type)}`}>
                  {getTypeIcon(currentProblem.type)} {currentProblem.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">{currentProblem.description}</p>
              
              {isComplete && validSolution && (
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">✓ Solution verified!</p>
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
                  onClick={showSolution}
                  className="w-full px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                >
                  Show Solution
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
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Legend</h3>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-green-500 bg-green-50 rounded"></div>
                  <span className="text-gray-600">Correct answer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-yellow-500 bg-yellow-50 rounded"></div>
                  <span className="text-gray-600">Partially correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-red-500 bg-red-50 rounded"></div>
                  <span className="text-gray-600">Incorrect answer</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-700">
                {currentProblem.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(currentProblem.type)}`}>
                {getTypeIcon(currentProblem.type)} {currentProblem.type.charAt(0).toUpperCase() + currentProblem.type.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{currentProblem.description}</p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-xl font-mono leading-relaxed text-gray-800 text-center">
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* Multiple Valid Solutions Display */}
          {currentProblem.acceptedAnswers.length > 1 && (
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-700 mb-2">Multiple Solutions Accepted</h4>
              <p className="text-sm text-blue-600">
                This problem has {currentProblem.acceptedAnswers.length} different valid solutions. 
                Try to find one that makes the equation true!
              </p>
            </div>
          )}

          {/* Solution Examples (only show after completion or when solution is shown) */}
          {(isComplete || validSolution) && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-3">Valid Solutions:</h4>
              <div className="grid gap-2">
                {currentProblem.acceptedAnswers.slice(0, 3).map((solution, index) => (
                  <div key={index} className="text-sm font-mono text-green-600">
                    Example {index + 1}: {Object.entries(solution).map(([key, value]) => `{${key}}: ${value}`).join(', ')}
                  </div>
                ))}
                {currentProblem.acceptedAnswers.length > 3 && (
                  <div className="text-sm text-green-600">
                    ... and {currentProblem.acceptedAnswers.length - 3} more solutions
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions based on problem type */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Instructions:</h4>
            <div className="text-sm text-gray-600">
              {currentProblem.type === 'equation' && (
                <p>Fill in the blanks to make both sides of the equation equal. Multiple solutions may be possible.</p>
              )}
              {currentProblem.type === 'units' && (
                <p>Complete the equation with correct numbers and units. Pay attention to unit conversions.</p>
              )}
              {currentProblem.type === 'text' && (
                <p>Fill in both numbers and text to complete the mathematical statement logically.</p>
              )}
              {currentProblem.type === 'fractions' && (
                <p>Complete the fraction equation to create equivalent fractions or solve the equation.</p>
              )}
              {currentProblem.type === 'matrices' && (
                <p>Fill in the matrix elements to complete the matrix operation correctly.</p>
              )}
              {currentProblem.type === 'blanks' && (
                <p>Fill in the missing terms to complete the mathematical formula or theorem.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}