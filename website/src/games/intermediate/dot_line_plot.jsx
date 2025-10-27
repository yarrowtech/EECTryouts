import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "pet-survey",
    title: "Pet Survey Data - Create Dot Plot",
    description: "Students were asked how many pets they have. Create a dot plot to represent this data.",
    plotType: "dot",
    data: [0, 1, 1, 2, 2, 2, 3, 1, 0, 2, 1, 3, 2, 1, 0],
    expectedCounts: { 0: 3, 1: 4, 2: 5, 3: 2 },
    xAxis: { min: 0, max: 4, step: 1, label: "Number of Pets" },
    yAxis: { min: 0, max: 6, step: 1, label: "Frequency" },
    mode: "create",
    hint: "Count how many students have 0 pets, 1 pet, 2 pets, etc. Stack dots vertically for each value."
  },
  {
    id: "test-scores",
    title: "Test Scores - Create Line Plot", 
    description: "Class test scores out of 10. Create a line plot showing the distribution.",
    plotType: "line",
    data: [7, 8, 9, 7, 8, 10, 9, 8, 7, 9, 8, 10, 9, 7, 8],
    expectedCounts: { 7: 4, 8: 5, 9: 4, 10: 2 },
    xAxis: { min: 6, max: 11, step: 1, label: "Test Score" },
    yAxis: { min: 0, max: 6, step: 1, label: "Number of Students" },
    mode: "create",
    hint: "Count the frequency of each score and draw lines proportional to the frequency."
  },
  {
    id: "modify-heights",
    title: "Student Heights - Modify Existing Plot",
    description: "This dot plot shows student heights. Some data points are missing. Add the missing dots.",
    plotType: "dot", 
    data: [58, 59, 60, 60, 61, 61, 61, 62, 59, 60],
    expectedCounts: { 58: 1, 59: 2, 60: 3, 61: 3, 62: 1 },
    xAxis: { min: 57, max: 63, step: 1, label: "Height (inches)" },
    yAxis: { min: 0, max: 4, step: 1, label: "Number of Students" },
    mode: "modify",
    initialPlot: { 58: 1, 59: 1, 60: 2, 61: 2, 62: 1 }, // Some dots already placed
    hint: "Compare the current plot with the data. Add dots where frequencies are too low."
  },
  {
    id: "rainfall-data",
    title: "Weekly Rainfall - Create Line Plot",
    description: "Daily rainfall amounts (inches) for two weeks. Create a line plot.",
    plotType: "line",
    data: [0, 0.5, 1, 0, 0.5, 1.5, 0.5, 0, 1, 0.5, 0, 1.5, 1, 0.5],
    expectedCounts: { 0: 4, 0.5: 5, 1: 3, 1.5: 2 },
    xAxis: { min: 0, max: 2, step: 0.5, label: "Rainfall (inches)" },
    yAxis: { min: 0, max: 6, step: 1, label: "Number of Days" },
    mode: "create",
    hint: "Count how many days had each rainfall amount. Use lines to show frequency."
  },
  {
    id: "book-pages",
    title: "Books Read - Modify Dot Plot",
    description: "Students reported books read last month. The plot is incomplete - add missing data points.",
    plotType: "dot",
    data: [2, 3, 4, 2, 3, 5, 4, 3, 2, 4, 5, 3, 4, 2, 3],
    expectedCounts: { 2: 4, 3: 5, 4: 4, 5: 2 },
    xAxis: { min: 1, max: 6, step: 1, label: "Books Read" },
    yAxis: { min: 0, max: 6, step: 1, label: "Number of Students" },
    mode: "modify",
    initialPlot: { 2: 2, 3: 3, 4: 2, 5: 1 }, // Partial data
    hint: "Check if the current plot matches the data. Add dots where counts are too low."
  },
  {
    id: "shoe-sizes",
    title: "Shoe Sizes - Create from Frequency Table",
    description: "Create a dot plot from this frequency table: Size 6: 2 students, Size 7: 5 students, Size 8: 4 students, Size 9: 3 students.",
    plotType: "dot",
    data: [], // No raw data, just frequency counts
    expectedCounts: { 6: 2, 7: 5, 8: 4, 9: 3 },
    xAxis: { min: 5, max: 10, step: 1, label: "Shoe Size" },
    yAxis: { min: 0, max: 6, step: 1, label: "Number of Students" },
    mode: "create",
    hint: "Place the exact number of dots specified in the frequency table for each shoe size."
  }
];

export default function DotLinePlotGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [plotData, setPlotData] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [plotType, setPlotType] = useState("dot");
  const canvasRef = useRef(null);

  useEffect(() => {
    const initialData = currentProblem.mode === "modify" && currentProblem.initialPlot 
      ? { ...currentProblem.initialPlot } 
      : {};
    setPlotData(initialData);
    setPlotType(currentProblem.plotType);
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
  }, [currentProblem]);

  useEffect(() => {
    checkCompletion();
    drawPlot();
  }, [plotData, plotType]);

  useEffect(() => {
    drawPlot();
  }, []);

  const checkCompletion = () => {
    const newFeedback = {};
    let allCorrect = true;

    Object.keys(currentProblem.expectedCounts).forEach(value => {
      const expected = currentProblem.expectedCounts[value];
      const actual = plotData[value] || 0;
      
      if (actual === expected) {
        newFeedback[value] = 'correct';
      } else if (actual > 0) {
        newFeedback[value] = actual < expected ? 'too-low' : 'too-high';
        allCorrect = false;
      } else {
        newFeedback[value] = 'missing';
        allCorrect = false;
      }
    });

    setFeedback(newFeedback);

    if (allCorrect) {
      setIsComplete(true);
      toast.success("Perfect! Your plot matches the data exactly!");
    } else {
      setIsComplete(false);
    }
  };

  const drawPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // X-axis
    ctx.moveTo(margin.left, margin.top + height);
    ctx.lineTo(margin.left + width, margin.top + height);
    // Y-axis
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + height);
    ctx.stroke();

    // Draw x-axis labels and ticks
    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const xStep = currentProblem.xAxis.step;
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    for (let x = currentProblem.xAxis.min; x <= currentProblem.xAxis.max; x += xStep) {
      const xPos = margin.left + ((x - currentProblem.xAxis.min) / xRange) * width;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(xPos, margin.top + height);
      ctx.lineTo(xPos, margin.top + height + 5);
      ctx.stroke();
      
      // Label
      ctx.fillText(x.toString(), xPos, margin.top + height + 20);
    }

    // Draw y-axis labels and ticks
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;
    const yStep = currentProblem.yAxis.step;
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let y = currentProblem.yAxis.min; y <= currentProblem.yAxis.max; y += yStep) {
      const yPos = margin.top + height - ((y - currentProblem.yAxis.min) / yRange) * height;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, yPos);
      ctx.lineTo(margin.left, yPos);
      ctx.stroke();
      
      // Label
      ctx.fillText(y.toString(), margin.left - 10, yPos);
    }

    // Draw axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px Arial';
    
    // X-axis label
    ctx.fillText(currentProblem.xAxis.label, margin.left + width / 2, canvas.height - 15);
    
    // Y-axis label (rotated)
    ctx.save();
    ctx.translate(15, margin.top + height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(currentProblem.yAxis.label, 0, 0);
    ctx.restore();

    // Draw plot data
    Object.entries(plotData).forEach(([xValue, count]) => {
      const x = parseFloat(xValue);
      const xPos = margin.left + ((x - currentProblem.xAxis.min) / xRange) * width;
      
      if (plotType === 'dot') {
        // Draw dots stacked vertically
        for (let i = 0; i < count; i++) {
          const yPos = margin.top + height - ((i + 0.5) / yRange) * height;
          
          ctx.fillStyle = feedback[xValue] === 'correct' ? '#10b981' : 
                         feedback[xValue] === 'too-high' ? '#ef4444' :
                         feedback[xValue] === 'too-low' ? '#f59e0b' : '#6366f1';
          
          ctx.beginPath();
          ctx.arc(xPos, yPos, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Draw line from x-axis to count height
        const yPos = margin.top + height - ((count - currentProblem.yAxis.min) / yRange) * height;
        
        ctx.strokeStyle = feedback[xValue] === 'correct' ? '#10b981' : 
                         feedback[xValue] === 'too-high' ? '#ef4444' :
                         feedback[xValue] === 'too-low' ? '#f59e0b' : '#6366f1';
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        ctx.moveTo(xPos, margin.top + height);
        ctx.lineTo(xPos, yPos);
        ctx.stroke();
        
        // Add circle at top of line
        ctx.fillStyle = ctx.strokeStyle;
        ctx.beginPath();
        ctx.arc(xPos, yPos, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to plot coordinates
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = canvas.width - margin.left - margin.right;
    const height = canvas.height - margin.top - margin.bottom;
    
    if (x < margin.left || x > margin.left + width || y < margin.top || y > margin.top + height) {
      return; // Click outside plot area
    }

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const clickedX = currentProblem.xAxis.min + ((x - margin.left) / width) * xRange;
    
    // Round to nearest step
    const roundedX = Math.round(clickedX / currentProblem.xAxis.step) * currentProblem.xAxis.step;
    
    if (roundedX < currentProblem.xAxis.min || roundedX > currentProblem.xAxis.max) {
      return;
    }

    const key = roundedX.toString();
    
    if (e.shiftKey) {
      // Shift+click to remove
      setPlotData(prev => ({
        ...prev,
        [key]: Math.max(0, (prev[key] || 0) - 1)
      }));
    } else {
      // Regular click to add
      setPlotData(prev => ({
        ...prev,
        [key]: (prev[key] || 0) + 1
      }));
    }
  };

  const resetPlot = () => {
    const initialData = currentProblem.mode === "modify" && currentProblem.initialPlot 
      ? { ...currentProblem.initialPlot } 
      : {};
    setPlotData(initialData);
    setFeedback({});
    setIsComplete(false);
  };

  const showSolution = () => {
    setPlotData({ ...currentProblem.expectedCounts });
    toast.info("Solution revealed!");
  };

  const togglePlotType = () => {
    setPlotType(prev => prev === 'dot' ? 'line' : 'dot');
  };

  const renderDataSummary = () => {
    if (currentProblem.data.length === 0) return null;

    const dataCounts = {};
    currentProblem.data.forEach(value => {
      dataCounts[value] = (dataCounts[value] || 0) + 1;
    });

    return (
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-700 mb-2">Raw Data:</h4>
        <div className="text-sm text-blue-600 mb-2">
          [{currentProblem.data.join(', ')}]
        </div>
        <div className="text-sm text-blue-600">
          <strong>Data Counts:</strong> {Object.entries(dataCounts).map(([value, count]) => 
            `${value}: ${count}`).join(', ')}
        </div>
      </div>
    );
  };

  const getScore = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = Object.keys(currentProblem.expectedCounts).length;
    return `${correctCount}/${totalCount}`;
  };

  const getScoreColor = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = Object.keys(currentProblem.expectedCounts).length;
    
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
            <h1 className="text-2xl font-semibold text-purple-700">Dot Plot / Line Plot</h1>
            <p className="mt-2 text-gray-600">
              Create or modify dot plots and line plots to represent data distributions.
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
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Plot Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plot Type:</span>
                  <button
                    onClick={togglePlotType}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      plotType === 'dot' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {plotType === 'dot' ? '● Dot Plot' : '━ Line Plot'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <span className={`text-sm font-medium ${
                    currentProblem.mode === 'create' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {currentProblem.mode === 'create' ? 'Create New' : 'Modify Existing'}
                  </span>
                </div>
              </div>
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
                  <p className="text-sm text-green-700 font-medium">✓ Plot complete!</p>
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
                  onClick={resetPlot}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Reset Plot
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
                <li>• Click on the plot to add data points</li>
                <li>• Shift+click to remove data points</li>
                <li>• Switch between dot and line plot views</li>
                <li>• Green = correct frequency</li>
                <li>• Yellow = too low, Red = too high</li>
              </ul>
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
          </div>

          {/* Data Summary */}
          {renderDataSummary()}

          {/* Plot Canvas */}
          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-purple-700">
                {plotType === 'dot' ? 'Dot Plot' : 'Line Plot'}
              </h4>
              <div className="text-sm text-gray-500">
                Click to add • Shift+click to remove
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onClick={handleCanvasClick}
                className="cursor-crosshair border border-gray-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Expected vs Actual */}
          <div className="border border-gray-200 bg-white rounded-xl p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Expected vs Actual Frequencies:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(currentProblem.expectedCounts).map(([value, expected]) => {
                const actual = plotData[value] || 0;
                const status = feedback[value];
                
                let statusColor = 'text-gray-600';
                let statusText = 'Missing';
                
                if (status === 'correct') {
                  statusColor = 'text-green-600';
                  statusText = 'Correct';
                } else if (status === 'too-high') {
                  statusColor = 'text-red-600';
                  statusText = 'Too High';
                } else if (status === 'too-low') {
                  statusColor = 'text-yellow-600';
                  statusText = 'Too Low';
                }
                
                return (
                  <div key={value} className="p-2 border border-gray-200 rounded text-center">
                    <div className="text-sm font-medium text-gray-700">{value}</div>
                    <div className="text-xs text-gray-500">Expected: {expected}</div>
                    <div className="text-xs text-gray-500">Actual: {actual}</div>
                    <div className={`text-xs font-medium ${statusColor}`}>{statusText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Success Message */}
          {isComplete && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Excellent work!</h4>
              <p className="text-sm text-green-600">
                Your {plotType} plot accurately represents the data. Try switching to {plotType === 'dot' ? 'line' : 'dot'} plot view or attempt another problem!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}