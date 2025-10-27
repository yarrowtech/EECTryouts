import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "basic-integers",
    title: "Basic Integers - Place Numbers on Number Line",
    description: "Drag the numbers to their correct positions on the number line.",
    numberLine: { min: 0, max: 10, step: 1 },
    dragItems: [
      { id: "num-3", value: 3, display: "3", type: "number" },
      { id: "num-7", value: 7, display: "7", type: "number" },
      { id: "num-5", value: 5, display: "5", type: "number" },
      { id: "num-1", value: 1, display: "1", type: "number" }
    ],
    tolerance: 0.2,
    hint: "Each number should be placed at its exact position on the number line."
  },
  {
    id: "negative-numbers",
    title: "Negative Numbers - Integer Placement",
    description: "Place both positive and negative numbers on the number line.",
    numberLine: { min: -5, max: 5, step: 1 },
    dragItems: [
      { id: "num-neg3", value: -3, display: "-3", type: "number" },
      { id: "num-2", value: 2, display: "2", type: "number" },
      { id: "num-neg1", value: -1, display: "-1", type: "number" },
      { id: "num-4", value: 4, display: "4", type: "number" }
    ],
    tolerance: 0.2,
    hint: "Negative numbers go to the left of zero, positive numbers to the right."
  },
  {
    id: "decimals",
    title: "Decimal Numbers - Precise Placement",
    description: "Drag decimal numbers to their correct positions.",
    numberLine: { min: 0, max: 5, step: 0.5 },
    dragItems: [
      { id: "num-1.5", value: 1.5, display: "1.5", type: "number" },
      { id: "num-3.5", value: 3.5, display: "3.5", type: "number" },
      { id: "num-2.5", value: 2.5, display: "2.5", type: "number" },
      { id: "num-4.5", value: 4.5, display: "4.5", type: "number" }
    ],
    tolerance: 0.1,
    hint: "Decimal numbers fall between whole numbers. 1.5 is halfway between 1 and 2."
  },
  {
    id: "fractions",
    title: "Fractions - Visual Representation",
    description: "Place fractions on the number line between 0 and 2.",
    numberLine: { min: 0, max: 2, step: 0.25 },
    dragItems: [
      { id: "frac-1/2", value: 0.5, display: "1/2", type: "fraction" },
      { id: "frac-3/4", value: 0.75, display: "3/4", type: "fraction" },
      { id: "frac-5/4", value: 1.25, display: "5/4", type: "fraction" },
      { id: "frac-3/2", value: 1.5, display: "3/2", type: "fraction" }
    ],
    tolerance: 0.1,
    hint: "Convert fractions to decimals: 1/2 = 0.5, 3/4 = 0.75, etc."
  },
  {
    id: "mixed-operations",
    title: "Mixed Numbers - Various Types",
    description: "Place different types of numbers (integers, decimals, fractions) on the line.",
    numberLine: { min: -2, max: 3, step: 0.5 },
    dragItems: [
      { id: "num-neg1.5", value: -1.5, display: "-1.5", type: "number" },
      { id: "frac-1/2", value: 0.5, display: "1/2", type: "fraction" },
      { id: "num-2", value: 2, display: "2", type: "number" },
      { id: "frac-neg1/2", value: -0.5, display: "-1/2", type: "fraction" }
    ],
    tolerance: 0.1,
    hint: "Mix of positive/negative numbers, decimals, and fractions. Convert everything to decimal form to compare."
  },
  {
    id: "ordering-challenge",
    title: "Ordering Challenge - Greater Than/Less Than",
    description: "Arrange these values in order from smallest to largest.",
    numberLine: { min: 0, max: 4, step: 0.25 },
    dragItems: [
      { id: "num-3.2", value: 3.2, display: "3.2", type: "number" },
      { id: "frac-7/2", value: 3.5, display: "7/2", type: "fraction" },
      { id: "num-3.1", value: 3.1, display: "3.1", type: "number" },
      { id: "frac-13/4", value: 3.25, display: "13/4", type: "fraction" }
    ],
    tolerance: 0.05,
    hint: "Convert all values to decimals and order them: 3.1 < 3.2 < 3.25 < 3.5"
  }
];

export default function NumberLineDragDropGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [dragItems, setDragItems] = useState([]);
  const [placedItems, setPlacedItems] = useState({});
  const [draggedItem, setDraggedItem] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const numberLineRef = useRef(null);

  useEffect(() => {
    setDragItems([...currentProblem.dragItems]);
    setPlacedItems({});
    setDraggedItem(null);
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
  }, [currentProblem]);

  useEffect(() => {
    checkPlacement();
  }, [placedItems]);

  const checkPlacement = () => {
    const newFeedback = {};
    let allPlaced = true;
    let allCorrect = true;

    currentProblem.dragItems.forEach((item) => {
      const placement = placedItems[item.id];
      
      if (!placement) {
        allPlaced = false;
        return;
      }

      const isCorrect = Math.abs(placement.value - item.value) <= currentProblem.tolerance;
      newFeedback[item.id] = isCorrect ? 'correct' : 'incorrect';
      
      if (!isCorrect) {
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allPlaced && allCorrect) {
      setIsComplete(true);
      toast.success("Perfect! All numbers are correctly placed!");
    } else {
      setIsComplete(false);
    }
  };

  const getNumberLinePosition = (value) => {
    const { min, max } = currentProblem.numberLine;
    const percentage = ((value - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  const getValueFromPosition = (percentage) => {
    const { min, max } = currentProblem.numberLine;
    return min + (percentage / 100) * (max - min);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (!draggedItem || !numberLineRef.current) return;

    const rect = numberLineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const value = getValueFromPosition(percentage);

    setPlacedItems(prev => ({
      ...prev,
      [draggedItem.id]: { value, percentage }
    }));

    setDragItems(prev => prev.filter(item => item.id !== draggedItem.id));
    setDraggedItem(null);
  };

  const handleItemReturn = (item) => {
    setDragItems(prev => [...prev, item]);
    setPlacedItems(prev => {
      const newPlaced = { ...prev };
      delete newPlaced[item.id];
      return newPlaced;
    });
    setFeedback(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[item.id];
      return newFeedback;
    });
  };

  const resetProblem = () => {
    setDragItems([...currentProblem.dragItems]);
    setPlacedItems({});
    setDraggedItem(null);
    setIsComplete(false);
    setFeedback({});
  };

  const showSolution = () => {
    const correctPlacements = {};
    currentProblem.dragItems.forEach((item) => {
      const percentage = getNumberLinePosition(item.value);
      correctPlacements[item.id] = { value: item.value, percentage };
    });
    setPlacedItems(correctPlacements);
    setDragItems([]);
    toast.info("Solution revealed!");
  };

  const renderNumberLine = () => {
    const { min, max, step } = currentProblem.numberLine;
    const ticks = [];
    
    for (let value = min; value <= max; value += step) {
      const position = getNumberLinePosition(value);
      ticks.push(
        <div key={value} className="absolute flex flex-col items-center" style={{ left: `${position}%` }}>
          <div className="w-0.5 h-6 bg-gray-400"></div>
          <span className="text-xs text-gray-600 mt-1">{value}</span>
        </div>
      );
    }

    return ticks;
  };

  const renderPlacedItems = () => {
    return Object.entries(placedItems).map(([itemId, placement]) => {
      const item = currentProblem.dragItems.find(i => i.id === itemId);
      if (!item) return null;

      const isCorrect = feedback[itemId] === 'correct';
      const colorClass = isCorrect ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600';

      return (
        <div
          key={itemId}
          className={`absolute transform -translate-x-1/2 cursor-pointer ${colorClass} text-white px-2 py-1 rounded border-2 text-sm font-medium hover:opacity-80 transition`}
          style={{ left: `${placement.percentage}%`, top: '-40px' }}
          onClick={() => handleItemReturn(item)}
          title={`Click to remove. Placed at ${placement.value.toFixed(2)} (target: ${item.value})`}
        >
          {item.display}
        </div>
      );
    });
  };

  const getItemTypeColor = (type) => {
    switch (type) {
      case 'number': return 'bg-blue-500 border-blue-600';
      case 'fraction': return 'bg-purple-500 border-purple-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getScore = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.dragItems.length;
    return `${correctCount}/${totalCount}`;
  };

  const getScoreColor = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.dragItems.length;
    
    if (correctCount === totalCount && totalCount > 0) return 'text-green-600';
    if (correctCount > 0) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Number Line Drag & Drop</h1>
            <p className="mt-2 text-gray-600">
              Drag numbers, decimals, and fractions to their correct positions on the number line.
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
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="text-sm font-medium text-purple-700">
                  {dragItems.length} items
                </span>
              </div>
              
              {isComplete && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">✓ All numbers placed correctly!</p>
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
                  onClick={resetProblem}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Reset Problem
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
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Numbers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-gray-600">Fractions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Correct placement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Incorrect placement</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              {currentProblem.title}
            </h3>
            <p className="text-gray-600 mb-4">{currentProblem.description}</p>
            
            <div className="text-sm text-gray-500 mb-4">
              Range: {currentProblem.numberLine.min} to {currentProblem.numberLine.max} 
              (step: {currentProblem.numberLine.step})
            </div>
          </div>

          {/* Draggable Items */}
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <h4 className="text-sm font-semibold text-purple-700 mb-4">Drag these items to the number line:</h4>
            <div className="flex flex-wrap gap-3">
              {dragItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className={`px-4 py-2 text-white rounded border-2 cursor-move text-sm font-medium hover:opacity-80 transition select-none ${getItemTypeColor(item.type)}`}
                >
                  {item.display}
                </div>
              ))}
              {dragItems.length === 0 && (
                <p className="text-gray-500 text-sm italic">All items have been placed on the number line.</p>
              )}
            </div>
          </div>

          {/* Number Line */}
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <h4 className="text-sm font-semibold text-purple-700 mb-6">Number Line:</h4>
            
            <div className="relative">
              <div
                ref={numberLineRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-300 transition"
              >
                {/* Number line base */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-400 transform -translate-y-1/2"></div>
                
                {/* Tick marks and labels */}
                <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
                  {renderNumberLine()}
                </div>
                
                {/* Placed items */}
                <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
                  {renderPlacedItems()}
                </div>
                
                {/* Drop zone instruction */}
                {dragItems.length > 0 && Object.keys(placedItems).length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Drop numbers here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {Object.keys(feedback).length > 0 && (
            <div className="border border-gray-200 bg-white rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Placement Feedback:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(feedback).map(([itemId, status]) => {
                  const item = currentProblem.dragItems.find(i => i.id === itemId);
                  const placement = placedItems[itemId];
                  if (!item || !placement) return null;
                  
                  const isCorrect = status === 'correct';
                  
                  return (
                    <div key={itemId} className={`p-2 rounded border ${
                      isCorrect 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <div className="text-sm">
                        {item.display}: {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="text-xs mt-1">
                        Placed at: {placement.value.toFixed(2)} 
                        {!isCorrect && ` (should be ${item.value})`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Instructions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Drag numbers from the top section to the number line</li>
              <li>• Position them as precisely as possible</li>
              <li>• Green items are correctly placed, red items need adjustment</li>
              <li>• Click on placed items to remove them and try again</li>
              <li>• Use the hint if you need help understanding number positions</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}