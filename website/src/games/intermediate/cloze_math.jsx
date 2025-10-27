import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "apples-problem",
    title: "Apple Distribution Problem",
    question: "Ethan has twice as many apples as Kris. Tim has one less apple than Kris. If Ethan has 12 apples, how many apples do Kris and Tim have?",
    template: "Kris has {0} apples and Tim has {1} apples.",
    answers: ["6", "5"],
    hints: ["Start by finding how many apples Kris has", "If Ethan has twice as many as Kris and Ethan has 12..."]
  },
  {
    id: "pencils-problem", 
    title: "Pencil Sharing Problem",
    question: "Sarah has 3 times as many pencils as Maya. Alex has 4 more pencils than Maya. If Sarah has 15 pencils, how many pencils do Maya and Alex have?",
    template: "Maya has {0} pencils and Alex has {1} pencils.",
    answers: ["5", "9"],
    hints: ["Find Maya's pencils first", "Sarah has 3 times Maya's amount"]
  },
  {
    id: "books-problem",
    title: "Book Collection Problem", 
    question: "The library has 5 times as many fiction books as non-fiction books. Mystery books are 2 more than non-fiction books. If there are 45 fiction books, how many non-fiction and mystery books are there?",
    template: "There are {0} non-fiction books and {1} mystery books.",
    answers: ["9", "11"],
    hints: ["Fiction books = 5 × non-fiction books", "Mystery books = non-fiction books + 2"]
  },
  {
    id: "money-problem",
    title: "Allowance Problem",
    question: "Jake gets twice the allowance of his sister Lisa. Their brother Mike gets $3 less than Lisa. If Jake gets $16, what are Lisa's and Mike's allowances?",
    template: "Lisa gets ${0} and Mike gets ${1}.",
    answers: ["8", "5"],
    hints: ["Jake gets twice Lisa's allowance", "Mike gets $3 less than Lisa"]
  },
  {
    id: "age-problem",
    title: "Age Comparison Problem",
    question: "Dad is 4 times older than his daughter Emma. Mom is 2 years younger than Dad. If Emma is 8 years old, how old are Dad and Mom?",
    template: "Dad is {0} years old and Mom is {1} years old.",
    answers: ["32", "30"],
    hints: ["Dad's age = 4 × Emma's age", "Mom's age = Dad's age - 2"]
  }
];

export default function ClozeMathGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    setUserAnswers({});
    setIsComplete(false);
    setShowHints(false);
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

      const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
      newFeedback[index] = isCorrect ? 'correct' : 'incorrect';
      
      if (!isCorrect) {
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allFilled && allCorrect) {
      setIsComplete(true);
      toast.success("Perfect! All answers are correct!");
    } else {
      setIsComplete(false);
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
        const feedbackClass = feedback[inputIndex] === 'correct' 
          ? 'border-green-500 bg-green-50' 
          : feedback[inputIndex] === 'incorrect' 
          ? 'border-red-500 bg-red-50' 
          : 'border-purple-300 bg-white';

        return (
          <input
            key={`input-${inputIndex}`}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(inputIndex, e.target.value)}
            className={`inline-block mx-1 px-2 py-1 text-center font-medium border-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-200 ${feedbackClass}`}
            style={{ width: '60px', minWidth: '60px' }}
            placeholder="?"
          />
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  };

  const getScoreColor = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.answers.length;
    
    if (correctCount === totalCount && totalCount > 0) return 'text-green-600';
    if (correctCount > 0) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScore = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.answers.length;
    return `${correctCount}/${totalCount}`;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Cloze Math</h1>
            <p className="mt-2 text-gray-600">
              Solve word problems by filling in the answer boxes with the correct numbers.
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
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Progress</h3>
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
                  onClick={() => setShowHints(!showHints)}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
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

            {showHints && (
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">Hints</h3>
                <ul className="text-sm text-blue-600 space-y-1">
                  {currentProblem.hints.map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read the word problem carefully</li>
                <li>• Fill in the answer boxes with numbers</li>
                <li>• Green border = correct answer</li>
                <li>• Red border = incorrect answer</li>
                <li>• Use hints if you need help</li>
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
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Problem:</h4>
              <p className="text-gray-700 leading-relaxed">
                {currentProblem.question}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-purple-700 mb-3">Answer:</h4>
              <div className="text-lg leading-relaxed text-gray-800">
                {renderTemplate()}
              </div>
            </div>
          </div>

          {/* Answer Key (only visible when all correct or when show answers is clicked) */}
          {(isComplete || Object.keys(userAnswers).length === currentProblem.answers.length) && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Solution Breakdown:</h4>
              <div className="text-sm text-green-600 space-y-1">
                {currentProblem.answers.map((answer, index) => (
                  <div key={index}>
                    Answer {index + 1}: <span className="font-medium">{answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback for individual answers */}
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
                      <span className="text-sm">
                        Answer {index + 1}: {userAnswer} {isCorrect ? '✓' : '✗'}
                      </span>
                      {!isCorrect && (
                        <div className="text-xs mt-1">
                          Correct answer: {correctAnswer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}