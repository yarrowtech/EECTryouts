import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "simple-addition",
    title: "Simple Addition",
    question: "Calculate: 247 + 156",
    answer: "403",
    type: "integer",
    columns: 3,
    hint: "Add column by column: 7+6=13 (write 3, carry 1), 4+5+1=10 (write 0, carry 1), 2+1+1=4"
  },
  {
    id: "decimal-multiplication",
    title: "Decimal Multiplication", 
    question: "Calculate: 12.5 × 3.2",
    answer: "40.0",
    type: "decimal",
    columns: 4,
    decimalPlaces: 1,
    hint: "Multiply as whole numbers: 125 × 32 = 4000, then place decimal point (1+1=2 places from right) = 40.00"
  },
  {
    id: "fraction-addition",
    title: "Fraction to Decimal",
    question: "Convert 3/8 to decimal",
    answer: "0.375",
    type: "decimal",
    columns: 5,
    decimalPlaces: 3,
    hint: "Divide 3 ÷ 8 = 0.375"
  },
  {
    id: "percentage-problem",
    title: "Percentage Calculation",
    question: "What is 15% of 240?",
    answer: "36",
    type: "integer", 
    columns: 2,
    hint: "15% = 0.15, so 0.15 × 240 = 36"
  },
  {
    id: "square-root",
    title: "Square Root",
    question: "√144 = ?",
    answer: "12",
    type: "integer",
    columns: 2,
    hint: "What number multiplied by itself equals 144? 12 × 12 = 144"
  },
  {
    id: "area-calculation",
    title: "Area of Rectangle",
    question: "Find the area of a rectangle with length 8.5 cm and width 6.4 cm",
    answer: "54.4",
    type: "decimal",
    columns: 4,
    decimalPlaces: 1,
    hint: "Area = length × width = 8.5 × 6.4 = 54.4 square cm"
  },
  {
    id: "time-conversion",
    title: "Time Conversion",
    question: "Convert 2.75 hours to minutes",
    answer: "165",
    type: "integer",
    columns: 3,
    hint: "2.75 hours = 2 hours + 0.75 hours = 120 minutes + 45 minutes = 165 minutes"
  },
  {
    id: "algebra-solve",
    title: "Solve for x",
    question: "Solve: 3x + 7 = 28",
    answer: "7",
    type: "integer",
    columns: 1,
    hint: "3x = 28 - 7 = 21, so x = 21 ÷ 3 = 7"
  }
];

export default function GriddedGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [gridAnswers, setGridAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setGridAnswers({});
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
    setShowValidation(false);
  }, [currentProblem]);

  const checkAnswer = () => {
    const userAnswer = constructAnswerFromGrid();
    const correctAnswer = currentProblem.answer;
    
    if (userAnswer === correctAnswer) {
      setIsComplete(true);
      setFeedback({ status: 'correct', message: 'Perfect! Your answer is correct.' });
      toast.success("Correct answer!");
    } else if (userAnswer === '') {
      setFeedback({ status: 'incomplete', message: 'Please fill in all required bubbles.' });
    } else {
      setFeedback({ status: 'incorrect', message: `Incorrect. You entered: ${userAnswer}, but the correct answer is: ${correctAnswer}` });
      toast.error("Incorrect answer. Try again!");
    }
    setShowValidation(true);
  };

  const constructAnswerFromGrid = () => {
    let answer = '';
    
    // Handle decimal point position
    let decimalInserted = false;
    
    for (let col = 0; col < currentProblem.columns; col++) {
      // Check if this column should have a decimal point
      if (currentProblem.type === 'decimal' && 
          currentProblem.decimalPlaces && 
          col === currentProblem.columns - currentProblem.decimalPlaces - 1 && 
          !decimalInserted) {
        answer += '.';
        decimalInserted = true;
      }
      
      const selectedDigit = gridAnswers[`col-${col}`];
      if (selectedDigit !== undefined) {
        answer += selectedDigit;
      } else if (showValidation) {
        return ''; // Incomplete answer
      }
    }
    
    return answer;
  };

  const handleBubbleClick = (column, digit) => {
    setGridAnswers(prev => ({
      ...prev,
      [`col-${column}`]: digit
    }));
    setShowValidation(false);
  };

  const clearGrid = () => {
    setGridAnswers({});
    setFeedback({});
    setShowValidation(false);
    setIsComplete(false);
  };

  const showSolution = () => {
    const answer = currentProblem.answer;
    const newGridAnswers = {};
    
    let digitIndex = 0;
    for (let col = 0; col < currentProblem.columns; col++) {
      // Skip decimal point
      if (answer[digitIndex] === '.') {
        digitIndex++;
      }
      
      if (digitIndex < answer.length) {
        newGridAnswers[`col-${col}`] = answer[digitIndex];
        digitIndex++;
      }
    }
    
    setGridAnswers(newGridAnswers);
    setFeedback({ status: 'revealed', message: 'Solution revealed!' });
    setShowValidation(true);
    toast.info("Solution revealed!");
  };

  const renderGrid = () => {
    const grid = [];
    
    for (let col = 0; col < currentProblem.columns; col++) {
      const columnBubbles = [];
      
      // Add column header
      columnBubbles.push(
        <div key={`header-${col}`} className="text-center text-sm font-semibold text-gray-700 mb-2">
          {/* Show decimal point indicator if needed */}
          {currentProblem.type === 'decimal' && 
           currentProblem.decimalPlaces && 
           col === currentProblem.columns - currentProblem.decimalPlaces - 1 ? 
           '•' : col + 1}
        </div>
      );
      
      // Add digit bubbles (0-9)
      for (let digit = 0; digit <= 9; digit++) {
        const isSelected = gridAnswers[`col-${col}`] === digit.toString();
        const bubbleClass = isSelected 
          ? 'bg-purple-600 border-purple-700' 
          : 'bg-white border-gray-300 hover:border-purple-400';
        
        columnBubbles.push(
          <button
            key={`${col}-${digit}`}
            onClick={() => handleBubbleClick(col, digit.toString())}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition ${bubbleClass} ${
              isSelected ? 'text-white' : 'text-gray-700'
            }`}
          >
            {digit}
          </button>
        );
      }
      
      grid.push(
        <div key={`col-${col}`} className="flex flex-col items-center space-y-1">
          {columnBubbles}
        </div>
      );
    }
    
    return grid;
  };

  const renderDecimalIndicator = () => {
    if (currentProblem.type !== 'decimal' || !currentProblem.decimalPlaces) {
      return null;
    }
    
    const decimalPosition = currentProblem.columns - currentProblem.decimalPlaces - 1;
    
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> This is a decimal answer. The decimal point goes after column {decimalPosition + 1} 
          (marked with •).
        </p>
      </div>
    );
  };

  const getAnswerPreview = () => {
    const preview = constructAnswerFromGrid();
    if (preview === '') return '(incomplete)';
    
    // Add decimal point for display if needed
    if (currentProblem.type === 'decimal' && currentProblem.decimalPlaces && !preview.includes('.')) {
      const insertPos = currentProblem.columns - currentProblem.decimalPlaces;
      return preview.slice(0, insertPos) + '.' + preview.slice(insertPos);
    }
    
    return preview;
  };

  const getFeedbackColor = () => {
    switch (feedback.status) {
      case 'correct': return 'text-green-600 border-green-200 bg-green-50';
      case 'incorrect': return 'text-red-600 border-red-200 bg-red-50';
      case 'incomplete': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'revealed': return 'text-blue-600 border-blue-200 bg-blue-50';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Gridded Response</h1>
            <p className="mt-2 text-gray-600">
              Fill in bubbles to create your answer independently, like an OMR sheet.
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
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Answer Preview</h3>
              <div className="bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <span className="font-mono text-lg">
                  {getAnswerPreview()}
                </span>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                Expected format: {currentProblem.type === 'decimal' ? 'decimal number' : 'whole number'}
                {currentProblem.type === 'decimal' && currentProblem.decimalPlaces && 
                  ` with ${currentProblem.decimalPlaces} decimal place(s)`}
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
                  onClick={clearGrid}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Clear Grid
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
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Solve the problem on paper first</li>
                <li>• Fill in one bubble per column</li>
                <li>• Start from the leftmost column</li>
                <li>• For decimals, note the decimal point position</li>
                <li>• Click "Check Answer" when complete</li>
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
              <div className="text-xl font-medium text-gray-800 text-center">
                {currentProblem.question}
              </div>
            </div>

            {renderDecimalIndicator()}
            
            <p className="text-gray-600 mb-6">
              Fill in the bubbles below to create your answer. Work out the problem first, then carefully 
              fill in one bubble per column.
            </p>
          </div>

          {/* Grid */}
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <h4 className="text-sm font-semibold text-purple-700 mb-6 text-center">
              Answer Grid - Fill one bubble per column
            </h4>
            
            <div className="flex justify-center">
              <div className="flex space-x-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                {renderGrid()}
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              Click on bubbles to fill them in. Only one bubble per column should be filled.
            </div>
          </div>

          {/* Feedback */}
          {showValidation && feedback.message && (
            <div className={`border rounded-xl p-4 ${getFeedbackColor()}`}>
              <h4 className="text-sm font-semibold mb-2">
                {feedback.status === 'correct' && '✓ Correct!'}
                {feedback.status === 'incorrect' && '✗ Incorrect'}
                {feedback.status === 'incomplete' && '⚠ Incomplete'}
                {feedback.status === 'revealed' && 'ℹ Solution'}
              </h4>
              <p className="text-sm">{feedback.message}</p>
            </div>
          )}

          {/* Success Message */}
          {isComplete && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Excellent work!</h4>
              <p className="text-sm text-green-600">
                You correctly solved the problem and filled in the grid accurately. This type of independent 
                answer entry helps develop problem-solving skills without being influenced by multiple choice options.
              </p>
            </div>
          )}

          {/* Problem Types Info */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">About Gridded Response:</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Purpose:</strong> Gridded response questions require you to solve problems independently 
                without being influenced by answer choices, similar to standardized test formats.
              </p>
              <p>
                <strong>Benefits:</strong> Develops computational accuracy, encourages complete problem-solving, 
                and builds confidence in mathematical reasoning.
              </p>
              <p>
                <strong>Format:</strong> Fill in bubbles to construct your numerical answer, ensuring precision 
                in both calculation and transcription.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}