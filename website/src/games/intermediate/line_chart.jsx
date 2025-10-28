import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "temperature-data",
    title: "Monthly Temperature Data",
    description: "Draw a line chart showing average monthly temperatures throughout the year.",
    xAxis: { min: 1, max: 12, step: 1, label: "Month" },
    yAxis: { min: 0, max: 40, step: 5, label: "Temperature (°C)" },
    gridLines: true,
    monthLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    sampleData: [
      { x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 12 }, { x: 4, y: 18 },
      { x: 5, y: 24 }, { x: 6, y: 30 }, { x: 7, y: 33 }, { x: 8, y: 32 },
      { x: 9, y: 27 }, { x: 10, y: 20 }, { x: 11, y: 12 }, { x: 12, y: 7 }
    ]
  },
  {
    id: "sales-growth",
    title: "Quarterly Sales Growth",
    description: "Create a line chart showing sales growth over 4 quarters.",
    xAxis: { min: 1, max: 4, step: 1, label: "Quarter" },
    yAxis: { min: 0, max: 100, step: 10, label: "Sales (thousands)" },
    gridLines: true,
    quarterLabels: ["Q1", "Q2", "Q3", "Q4"],
    sampleData: [
      { x: 1, y: 30 }, { x: 2, y: 45 }, { x: 3, y: 60 }, { x: 4, y: 85 }
    ]
  },
  {
    id: "student-progress",
    title: "Student Test Scores Over Time",
    description: "Track a student's test scores improvement over 8 tests.",
    xAxis: { min: 1, max: 8, step: 1, label: "Test Number" },
    yAxis: { min: 60, max: 100, step: 5, label: "Score (%)" },
    gridLines: true,
    sampleData: [
      { x: 1, y: 65 }, { x: 2, y: 70 }, { x: 3, y: 68 }, { x: 4, y: 75 },
      { x: 5, y: 82 }, { x: 6, y: 85 }, { x: 7, y: 88 }, { x: 8, y: 92 }
    ]
  }
];

const TOOLS = {
  DRAW: "draw",
  EDIT: "edit",
  DELETE: "delete"
};

export default function LineChart() {
  const canvasRef = useRef(null);
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [dataPoints, setDataPoints] = useState([]);
  const [currentTool, setCurrentTool] = useState(TOOLS.DRAW);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [lineColor, setLineColor] = useState("#2563eb");
  const [lineWidth, setLineWidth] = useState(2);
  const [pointSize, setPointSize] = useState(4);
  const [showSampleData, setShowSampleData] = useState(false);

  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;

  useEffect(() => {
    setDataPoints([]);
    setSelectedPoint(null);
    setShowSampleData(false);
    resizeCanvasToContainer();
  }, [currentProblem]);

  useEffect(() => {
    drawChart();
  }, [dataPoints, showGrid, lineColor, lineWidth, pointSize, showSampleData, currentProblem]);

  const resizeCanvasToContainer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();

    const aspect = BASE_WIDTH / BASE_HEIGHT;
    let cssWidth = containerRect.width - 40;
    let cssHeight = cssWidth / aspect;
    
    if (cssHeight > containerRect.height - 40) {
      cssHeight = containerRect.height - 40;
      cssWidth = cssHeight * aspect;
    }

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawChart();
  };

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const cssWidth = parseFloat(canvas.style.width);
    const cssHeight = parseFloat(canvas.style.height);
    
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const plotWidth = cssWidth - margin.left - margin.right;
    const plotHeight = cssHeight - margin.top - margin.bottom;

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, margin, plotWidth, plotHeight);
    }

    // Draw axes
    drawAxes(ctx, margin, plotWidth, plotHeight);

    // Draw sample data if enabled
    if (showSampleData && currentProblem.sampleData) {
      drawSampleData(ctx, margin, plotWidth, plotHeight);
    }

    // Draw user data
    drawUserData(ctx, margin, plotWidth, plotHeight);
  };

  const drawGrid = (ctx, margin, plotWidth, plotHeight) => {
    ctx.save();
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    // Vertical grid lines
    for (let x = currentProblem.xAxis.min; x <= currentProblem.xAxis.max; x += currentProblem.xAxis.step) {
      const xPos = margin.left + ((x - currentProblem.xAxis.min) / xRange) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(xPos, margin.top);
      ctx.lineTo(xPos, margin.top + plotHeight);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = currentProblem.yAxis.min; y <= currentProblem.yAxis.max; y += currentProblem.yAxis.step) {
      const yPos = margin.top + plotHeight - ((y - currentProblem.yAxis.min) / yRange) * plotHeight;
      ctx.beginPath();
      ctx.moveTo(margin.left, yPos);
      ctx.lineTo(margin.left + plotWidth, yPos);
      ctx.stroke();
    }

    ctx.restore();
  };

  const drawAxes = (ctx, margin, plotWidth, plotHeight) => {
    ctx.save();
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 2;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + plotHeight);
    ctx.lineTo(margin.left + plotWidth, margin.top + plotHeight);
    ctx.stroke();

    // Draw labels and ticks
    ctx.fillStyle = "#374151";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    // X-axis labels
    for (let x = currentProblem.xAxis.min; x <= currentProblem.xAxis.max; x += currentProblem.xAxis.step) {
      const xPos = margin.left + ((x - currentProblem.xAxis.min) / xRange) * plotWidth;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(xPos, margin.top + plotHeight);
      ctx.lineTo(xPos, margin.top + plotHeight + 5);
      ctx.stroke();
      
      // Label
      let label = x.toString();
      if (currentProblem.monthLabels && x >= 1 && x <= 12) {
        label = currentProblem.monthLabels[x - 1];
      } else if (currentProblem.quarterLabels && x >= 1 && x <= 4) {
        label = currentProblem.quarterLabels[x - 1];
      }
      
      ctx.fillText(label, xPos, margin.top + plotHeight + 10);
    }

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    
    for (let y = currentProblem.yAxis.min; y <= currentProblem.yAxis.max; y += currentProblem.yAxis.step) {
      const yPos = margin.top + plotHeight - ((y - currentProblem.yAxis.min) / yRange) * plotHeight;
      
      // Tick mark
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, yPos);
      ctx.lineTo(margin.left, yPos);
      ctx.stroke();
      
      // Label
      ctx.fillText(y.toString(), margin.left - 10, yPos);
    }

    // Axis titles
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    
    // X-axis title
    ctx.fillText(currentProblem.xAxis.label, margin.left + plotWidth / 2, margin.top + plotHeight + 50);
    
    // Y-axis title (rotated)
    ctx.save();
    ctx.translate(20, margin.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(currentProblem.yAxis.label, 0, 0);
    ctx.restore();

    ctx.restore();
  };

  const drawSampleData = (ctx, margin, plotWidth, plotHeight) => {
    if (!currentProblem.sampleData || currentProblem.sampleData.length === 0) return;

    ctx.save();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    const points = currentProblem.sampleData.map(point => ({
      x: margin.left + ((point.x - currentProblem.xAxis.min) / xRange) * plotWidth,
      y: margin.top + plotHeight - ((point.y - currentProblem.yAxis.min) / yRange) * plotHeight
    }));

    // Draw sample line
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();

    // Draw sample points
    ctx.setLineDash([]);
    ctx.fillStyle = "#94a3b8";
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  const drawUserData = (ctx, margin, plotWidth, plotHeight) => {
    if (dataPoints.length === 0) return;

    ctx.save();
    
    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    const sortedPoints = [...dataPoints].sort((a, b) => a.x - b.x);
    const canvasPoints = sortedPoints.map(point => ({
      x: margin.left + ((point.x - currentProblem.xAxis.min) / xRange) * plotWidth,
      y: margin.top + plotHeight - ((point.y - currentProblem.yAxis.min) / yRange) * plotHeight,
      dataX: point.x,
      dataY: point.y
    }));

    // Draw line
    if (canvasPoints.length > 1) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      canvasPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }

    // Draw points
    canvasPoints.forEach((point, index) => {
      const isSelected = selectedPoint === index;
      
      ctx.fillStyle = isSelected ? "#ef4444" : lineColor;
      ctx.beginPath();
      ctx.arc(point.x, point.y, isSelected ? pointSize + 2 : pointSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw white border for selected point
      if (isSelected) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.restore();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const screenToDataCoords = (screenX, screenY) => {
    const canvas = canvasRef.current;
    const cssWidth = parseFloat(canvas.style.width);
    const cssHeight = parseFloat(canvas.style.height);
    
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const plotWidth = cssWidth - margin.left - margin.right;
    const plotHeight = cssHeight - margin.top - margin.bottom;

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    const dataX = currentProblem.xAxis.min + ((screenX - margin.left) / plotWidth) * xRange;
    const dataY = currentProblem.yAxis.min + ((margin.top + plotHeight - screenY) / plotHeight) * yRange;

    return { x: dataX, y: dataY };
  };

  const findNearestPoint = (mouseX, mouseY) => {
    const canvas = canvasRef.current;
    const cssWidth = parseFloat(canvas.style.width);
    const cssHeight = parseFloat(canvas.style.height);
    
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const plotWidth = cssWidth - margin.left - margin.right;
    const plotHeight = cssHeight - margin.top - margin.bottom;

    const xRange = currentProblem.xAxis.max - currentProblem.xAxis.min;
    const yRange = currentProblem.yAxis.max - currentProblem.yAxis.min;

    let nearestIndex = -1;
    let minDistance = Infinity;

    dataPoints.forEach((point, index) => {
      const screenX = margin.left + ((point.x - currentProblem.xAxis.min) / xRange) * plotWidth;
      const screenY = margin.top + plotHeight - ((point.y - currentProblem.yAxis.min) / yRange) * plotHeight;
      
      const distance = Math.sqrt((mouseX - screenX) ** 2 + (mouseY - screenY) ** 2);
      
      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  const handleCanvasClick = (e) => {
    const pos = getMousePos(e);
    const dataCoords = screenToDataCoords(pos.x, pos.y);

    // Check if click is within plot area
    const canvas = canvasRef.current;
    const cssWidth = parseFloat(canvas.style.width);
    const cssHeight = parseFloat(canvas.style.height);
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };

    if (pos.x < margin.left || pos.x > cssWidth - margin.right ||
        pos.y < margin.top || pos.y > cssHeight - margin.bottom) {
      return;
    }

    switch (currentTool) {
      case TOOLS.DRAW: {
        // Clamp coordinates to axis ranges
        const clampedX = Math.max(currentProblem.xAxis.min, Math.min(currentProblem.xAxis.max, dataCoords.x));
        const clampedY = Math.max(currentProblem.yAxis.min, Math.min(currentProblem.yAxis.max, dataCoords.y));
        
        setDataPoints(prev => [...prev, { x: clampedX, y: clampedY }]);
        toast.success("Point added!");
        break;
      }

      case TOOLS.EDIT: {
        const pointIndex = findNearestPoint(pos.x, pos.y);
        if (pointIndex !== -1) {
          setSelectedPoint(pointIndex);
          setIsDrawing(true);
        }
        break;
      }

      case TOOLS.DELETE: {
        const deleteIndex = findNearestPoint(pos.x, pos.y);
        if (deleteIndex !== -1) {
          setDataPoints(prev => prev.filter((_, index) => index !== deleteIndex));
          setSelectedPoint(null);
          toast.success("Point deleted!");
        }
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || selectedPoint === null || currentTool !== TOOLS.EDIT) return;

    const pos = getMousePos(e);
    const dataCoords = screenToDataCoords(pos.x, pos.y);

    // Clamp coordinates to axis ranges
    const clampedX = Math.max(currentProblem.xAxis.min, Math.min(currentProblem.xAxis.max, dataCoords.x));
    const clampedY = Math.max(currentProblem.yAxis.min, Math.min(currentProblem.yAxis.max, dataCoords.y));

    setDataPoints(prev => prev.map((point, index) => 
      index === selectedPoint ? { x: clampedX, y: clampedY } : point
    ));
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
    if (selectedPoint !== null) {
      toast.success("Point updated!");
    }
  };

  const clearChart = () => {
    setDataPoints([]);
    setSelectedPoint(null);
    toast.success("Chart cleared!");
  };

  const loadSampleData = () => {
    if (currentProblem.sampleData) {
      setDataPoints([...currentProblem.sampleData]);
      setSelectedPoint(null);
      toast.success("Sample data loaded!");
    }
  };

  const exportChart = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `line-chart-${currentProblem.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Chart exported!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">
        {/* Left Sidebar */}
        <aside className="w-80 flex-shrink-0 border border-purple-200 bg-white rounded-xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-purple-700">Line Chart Tool</h1>
            <p className="mt-2 text-gray-600">
              Create and edit interactive line charts with drawing tools.
            </p>
          </div>

          <div className="space-y-4">
            {/* Problem Selection */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-purple-700 mb-3">Select Problem</h2>
              <select
                value={currentProblem.id}
                onChange={(e) => setCurrentProblem(SAMPLE_PROBLEMS.find(p => p.id === e.target.value))}
                className="w-full rounded border border-purple-300 bg-purple-50 px-3 py-2 text-sm text-purple-700 outline-none focus:border-purple-500 focus:bg-white"
              >
                {SAMPLE_PROBLEMS.map(problem => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Tools */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Drawing Tools</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {Object.values(TOOLS).map(tool => (
                  <button
                    key={tool}
                    onClick={() => {
                      setCurrentTool(tool);
                      setSelectedPoint(null);
                      setIsDrawing(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition ${
                      currentTool === tool
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {tool === TOOLS.DRAW && "✏️ Draw"}
                    {tool === TOOLS.EDIT && "✏️ Edit"}
                    {tool === TOOLS.DELETE && "🗑️ Delete"}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Line Color</label>
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-full h-6 rounded border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Line Width: {lineWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Point Size: {pointSize}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={pointSize}
                    onChange={(e) => setPointSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showGrid"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showGrid" className="text-xs text-gray-700">Show Grid</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showSample"
                    checked={showSampleData}
                    onChange={(e) => setShowSampleData(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showSample" className="text-xs text-gray-700">Show Sample Data</label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={loadSampleData}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                >
                  Load Sample Data
                </button>
                <button
                  onClick={clearChart}
                  className="w-full px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition"
                >
                  Clear Chart
                </button>
                <button
                  onClick={exportChart}
                  className="w-full px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition"
                >
                  Export PNG
                </button>
              </div>
            </div>

            {/* Data Points */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">
                Data Points ({dataPoints.length})
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {dataPoints.length === 0 ? (
                  <p className="text-xs text-gray-500">No data points yet</p>
                ) : (
                  dataPoints.map((point, index) => (
                    <div
                      key={index}
                      className={`text-xs p-2 rounded border ${
                        selectedPoint === index
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      Point {index + 1}: ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Draw:</strong> Click to add new points</li>
                <li>• <strong>Edit:</strong> Click and drag to move points</li>
                <li>• <strong>Delete:</strong> Click on points to remove them</li>
                <li>• Points are automatically connected with lines</li>
                <li>• Selected points are highlighted in red</li>
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
            <p className="text-gray-600">{currentProblem.description}</p>
          </div>

          <div className="border border-purple-200 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-purple-700">Interactive Line Chart</h4>
              <div className="text-sm text-gray-500">
                Current Tool: <span className="font-medium text-purple-600">{currentTool}</span>
              </div>
            </div>
            
            <div 
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
              style={{ minHeight: "500px" }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className="cursor-crosshair border border-gray-300 rounded bg-white block mx-auto"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}