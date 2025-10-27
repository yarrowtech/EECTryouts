import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  { 
    id: "percentage-40", 
    title: "Highlight 40% of the grid", 
    description: "Click cells to highlight exactly 40% of the total grid.",
    target: 40,
    gridSize: 10
  },
  { 
    id: "fraction-3-4", 
    title: "Highlight 3/4 of the grid", 
    description: "Click cells to highlight exactly 3/4 (75%) of the total grid.",
    target: 75,
    gridSize: 8
  },
  { 
    id: "ratio-2-5", 
    title: "Show ratio 2:5", 
    description: "Highlight cells to show a 2:5 ratio (2 parts highlighted, 5 parts total).",
    target: 40,
    gridSize: 10
  },
  { 
    id: "decimal-0-6", 
    title: "Highlight 0.6 of the grid", 
    description: "Click cells to highlight exactly 0.6 (60%) of the total grid.",
    target: 60,
    gridSize: 10
  }
];

export default function ShadingGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [shadedCells, setShadedCells] = useState(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const totalCells = currentProblem.gridSize * currentProblem.gridSize;
  const targetCells = Math.round((currentProblem.target / 100) * totalCells);
  const currentPercentage = Math.round((shadedCells.size / totalCells) * 100);

  useEffect(() => {
    setShadedCells(new Set());
    setIsComplete(false);
  }, [currentProblem]);

  useEffect(() => {
    const isCorrect = Math.abs(currentPercentage - currentProblem.target) <= 1;
    setIsComplete(isCorrect && shadedCells.size > 0);
    
    if (isCorrect && shadedCells.size > 0) {
      toast.success(`Correct! You highlighted ${currentPercentage}%`);
    }
  }, [shadedCells.size, currentPercentage, currentProblem.target]);

  const toggleCell = (row, col) => {
    const cellId = `${row}-${col}`;
    const newShadedCells = new Set(shadedCells);
    
    if (newShadedCells.has(cellId)) {
      newShadedCells.delete(cellId);
    } else {
      newShadedCells.add(cellId);
    }
    
    setShadedCells(newShadedCells);
  };

  const clearGrid = () => {
    setShadedCells(new Set());
    setIsComplete(false);
  };

  const renderGrid = () => {
    const grid = [];
    const cellSize = Math.min(400 / currentProblem.gridSize, 40);
    
    for (let row = 0; row < currentProblem.gridSize; row++) {
      for (let col = 0; col < currentProblem.gridSize; col++) {
        const cellId = `${row}-${col}`;
        const isShaded = shadedCells.has(cellId);
        
        grid.push(
          <button
            key={cellId}
            onClick={() => toggleCell(row, col)}
            className={`border border-gray-400 transition-colors duration-200 ${
              isShaded 
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'bg-white hover:bg-gray-100'
            }`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        );
      }
    }
    
    return grid;
  };

  const getProgressColor = () => {
    const diff = Math.abs(currentPercentage - currentProblem.target);
    if (diff <= 1) return 'text-green-600';
    if (diff <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTarget = () => {
    switch (currentProblem.id) {
      case 'fraction-3-4':
        return '3/4 (75%)';
      case 'ratio-2-5':
        return '2:5 ratio (40%)';
      case 'decimal-0-6':
        return '0.6 (60%)';
      default:
        return `${currentProblem.target}%`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Shading Game</h1>
            <p className="mt-2 text-gray-600">
              Visual representation of fractions, percentages, and ratios through grid shading.
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
              <h3 className="text-sm font-semibold text-purple-700 mb-2">
                Current Challenge
              </h3>
              <p className="text-sm text-gray-700 mb-3">{currentProblem.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-medium text-purple-700">{formatTarget()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current:</span>
                  <span className={`font-medium ${getProgressColor()}`}>
                    {currentPercentage}% ({shadedCells.size}/{totalCells})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Grid Size:</span>
                  <span className="font-medium text-gray-700">
                    {currentProblem.gridSize}×{currentProblem.gridSize}
                  </span>
                </div>
              </div>

              {isComplete && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 font-medium">✓ Perfect!</p>
                </div>
              )}
            </div>

            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click cells to shade/unshade them</li>
                <li>• Match the target percentage exactly</li>
                <li>• Use visual patterns to help you</li>
                <li>• Clear to start over anytime</li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-4">
          <div className="border border-purple-200 bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-700">
                  {currentProblem.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click cells to shade them. Target: {formatTarget()}
                </p>
              </div>
              <button
                onClick={clearGrid}
                className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
              >
                Clear Grid
              </button>
            </div>
          </div>

          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <div className="flex justify-center">
              <div 
                className="inline-grid gap-1 p-4 bg-gray-50 rounded-lg border"
                style={{
                  gridTemplateColumns: `repeat(${currentProblem.gridSize}, 1fr)`,
                }}
              >
                {renderGrid()}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="border border-purple-200 bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className={`text-sm font-medium ${getProgressColor()}`}>
                {currentPercentage}% / {currentProblem.target}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(currentPercentage, 100)}%` }}
              />
              {currentProblem.target <= 100 && (
                <div 
                  className="absolute h-3 w-1 bg-red-500 -mt-3"
                  style={{ marginLeft: `${currentProblem.target}%` }}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}