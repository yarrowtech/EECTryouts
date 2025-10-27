import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  {
    id: "pie-chart-1",
    title: "Pie Chart - Missing Percentage",
    description: "In the pie chart below, one section does not have a label. Fill in the missing percentage represented by the yellow section.",
    imageType: "pie-chart",
    inputBoxes: [
      { id: "yellow-section", x: 65, y: 30, width: 60, answer: "25", unit: "%" }
    ],
    imageData: {
      sections: [
        { color: "#ff6b6b", percentage: 35, label: "35%", startAngle: 0 },
        { color: "#4ecdc4", percentage: 20, label: "20%", startAngle: 126 },
        { color: "#45b7d1", percentage: 20, label: "20%", startAngle: 198 },
        { color: "#f9ca24", percentage: 25, label: "", startAngle: 270 } // Missing label
      ]
    },
    hint: "All sections of a pie chart should add up to 100%. Add up the labeled sections and subtract from 100%."
  },
  {
    id: "bar-chart-1", 
    title: "Bar Chart - Missing Values",
    description: "Complete the bar chart by filling in the missing values based on the pattern.",
    imageType: "bar-chart",
    inputBoxes: [
      { id: "bar-c", x: 50, y: 85, width: 40, answer: "30", unit: "" },
      { id: "bar-d", x: 75, y: 75, width: 40, answer: "40", unit: "" }
    ],
    imageData: {
      bars: [
        { label: "A", value: 10, color: "#ff6b6b" },
        { label: "B", value: 20, color: "#4ecdc4" },
        { label: "C", value: null, color: "#45b7d1" }, // Missing value
        { label: "D", value: null, color: "#f9ca24" }  // Missing value
      ],
      pattern: "incremental"
    },
    hint: "Look at the pattern in values A and B. Each bar increases by 10."
  },
  {
    id: "geometry-triangle",
    title: "Triangle - Missing Angle",
    description: "Find the missing angle in the triangle. Remember that all angles in a triangle sum to 180°.",
    imageType: "triangle",
    inputBoxes: [
      { id: "angle-c", x: 70, y: 20, width: 50, answer: "60", unit: "°" }
    ],
    imageData: {
      angles: [
        { label: "A", value: 70, position: "bottom-left" },
        { label: "B", value: 50, position: "bottom-right" },
        { label: "C", value: null, position: "top" } // Missing angle
      ]
    },
    hint: "The sum of all angles in a triangle is always 180°. Subtract the known angles from 180°."
  },
  {
    id: "coordinate-plane",
    title: "Coordinate Plane - Point Coordinates", 
    description: "Fill in the coordinates of the marked point on the coordinate plane.",
    imageType: "coordinate-plane",
    inputBoxes: [
      { id: "x-coord", x: 25, y: 85, width: 40, answer: "3", unit: "" },
      { id: "y-coord", x: 75, y: 85, width: 40, answer: "4", unit: "" }
    ],
    imageData: {
      point: { x: 3, y: 4 },
      gridSize: 10,
      maxX: 5,
      maxY: 5
    },
    hint: "Count the units along the x-axis (horizontal) and y-axis (vertical) from the origin."
  },
  {
    id: "fraction-visual",
    title: "Visual Fractions - Shaded Parts",
    description: "Look at the shaded rectangle and fill in the fraction it represents.",
    imageType: "fraction-visual",
    inputBoxes: [
      { id: "numerator", x: 30, y: 85, width: 40, answer: "3", unit: "" },
      { id: "denominator", x: 70, y: 85, width: 40, answer: "8", unit: "" }
    ],
    imageData: {
      totalParts: 8,
      shadedParts: 3,
      arrangement: "2x4" // 2 rows, 4 columns
    },
    hint: "Count the total number of parts and how many are shaded. Fraction = shaded parts / total parts."
  }
];

export default function ClozeMathImageGame() {
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    setUserAnswers({});
    setIsComplete(false);
    setShowHint(false);
    setFeedback({});
    drawImage();
  }, [currentProblem]);

  useEffect(() => {
    checkAnswers();
  }, [userAnswers]);

  useEffect(() => {
    drawImage();
  }, []);

  const drawImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    switch (currentProblem.imageType) {
      case 'pie-chart':
        drawPieChart(ctx);
        break;
      case 'bar-chart':
        drawBarChart(ctx);
        break;
      case 'triangle':
        drawTriangle(ctx);
        break;
      case 'coordinate-plane':
        drawCoordinatePlane(ctx);
        break;
      case 'fraction-visual':
        drawFractionVisual(ctx);
        break;
    }
  };

  const drawPieChart = (ctx) => {
    const centerX = 200;
    const centerY = 150;
    const radius = 80;
    
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    let currentAngle = 0;
    
    currentProblem.imageData.sections.forEach((section, index) => {
      const angle = (section.percentage / 100) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + angle);
      ctx.closePath();
      ctx.fillStyle = section.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (section.label) {
        const labelAngle = currentAngle + angle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(section.label, labelX, labelY);
      }
      
      currentAngle += angle;
    });
  };

  const drawBarChart = (ctx) => {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    const barWidth = 60;
    const maxHeight = 150;
    const startX = 50;
    const startY = 250;
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, startY);
    ctx.lineTo(360, startY);
    ctx.moveTo(40, startY);
    ctx.lineTo(40, 80);
    ctx.stroke();
    
    currentProblem.imageData.bars.forEach((bar, index) => {
      const x = startX + index * 80;
      const height = bar.value ? (bar.value / 50) * maxHeight : 0;
      const y = startY - height;
      
      if (bar.value) {
        ctx.fillStyle = bar.color;
        ctx.fillRect(x, y, barWidth, height);
        
        // Value label on top
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(bar.value.toString(), x + barWidth/2, y - 5);
      }
      
      // Bar label
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(bar.label, x + barWidth/2, startY + 20);
    });
  };

  const drawTriangle = (ctx) => {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    const points = [
      { x: 200, y: 50 },  // Top
      { x: 100, y: 200 }, // Bottom left
      { x: 300, y: 200 }  // Bottom right
    ];
    
    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw angle labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // Angle A (bottom left)
    ctx.fillText('A: 70°', points[1].x - 20, points[1].y + 25);
    
    // Angle B (bottom right)  
    ctx.fillText('B: 50°', points[2].x + 20, points[2].y + 25);
    
    // Angle C (top) - missing
    ctx.fillText('C: ?°', points[0].x, points[0].y - 15);
  };

  const drawCoordinatePlane = (ctx) => {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    const gridSize = 30;
    const originX = 200;
    const originY = 150;
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 400; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 300);
      ctx.stroke();
    }
    for (let i = 0; i <= 300; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(400, i);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(400, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, 300);
    ctx.stroke();
    
    // Draw point
    const pointX = originX + currentProblem.imageData.point.x * gridSize;
    const pointY = originY - currentProblem.imageData.point.y * gridSize;
    
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('0', originX - 10, originY + 15);
    ctx.fillText('x', 390, originY + 15);
    ctx.fillText('y', originX - 10, 15);
  };

  const drawFractionVisual = (ctx) => {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 400, 300);
    
    const totalParts = currentProblem.imageData.totalParts;
    const shadedParts = currentProblem.imageData.shadedParts;
    const cols = 4;
    const rows = 2;
    
    const rectWidth = 40;
    const rectHeight = 30;
    const startX = 100;
    const startY = 100;
    
    for (let i = 0; i < totalParts; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = startX + col * (rectWidth + 5);
      const y = startY + row * (rectHeight + 5);
      
      ctx.fillStyle = i < shadedParts ? '#4ecdc4' : '#fff';
      ctx.fillRect(x, y, rectWidth, rectHeight);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, rectWidth, rectHeight);
    }
    
    // Fraction template
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('=', 200, 220);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 240);
    ctx.lineTo(220, 240);
    ctx.stroke();
  };

  const checkAnswers = () => {
    const newFeedback = {};
    let allCorrect = true;
    let allFilled = true;

    currentProblem.inputBoxes.forEach((box) => {
      const userAnswer = userAnswers[box.id]?.trim();
      
      if (!userAnswer) {
        allFilled = false;
        return;
      }

      const isCorrect = userAnswer === box.answer;
      newFeedback[box.id] = isCorrect ? 'correct' : 'incorrect';
      
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

  const handleInputChange = (boxId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [boxId]: value
    }));
  };

  const clearAnswers = () => {
    setUserAnswers({});
    setFeedback({});
    setIsComplete(false);
  };

  const showAnswers = () => {
    const answers = {};
    currentProblem.inputBoxes.forEach((box) => {
      answers[box.id] = box.answer;
    });
    setUserAnswers(answers);
    toast.info("Answers revealed!");
  };

  const renderInputBoxes = () => {
    return currentProblem.inputBoxes.map((box) => {
      const value = userAnswers[box.id] || '';
      const feedbackClass = feedback[box.id] === 'correct' 
        ? 'border-green-500 bg-green-50' 
        : feedback[box.id] === 'incorrect' 
        ? 'border-red-500 bg-red-50' 
        : 'border-purple-300 bg-white';

      return (
        <div
          key={box.id}
          className="absolute flex items-center"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(box.id, e.target.value)}
            className={`px-2 py-1 text-center font-medium border-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-200 ${feedbackClass}`}
            style={{ width: `${box.width}px` }}
            placeholder="?"
          />
          {box.unit && (
            <span className="ml-1 text-sm font-medium text-gray-600">{box.unit}</span>
          )}
        </div>
      );
    });
  };

  const getScore = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.inputBoxes.length;
    return `${correctCount}/${totalCount}`;
  };

  const getScoreColor = () => {
    const correctCount = Object.values(feedback).filter(f => f === 'correct').length;
    const totalCount = currentProblem.inputBoxes.length;
    
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
            <h1 className="text-2xl font-semibold text-purple-700">Cloze Math with Image</h1>
            <p className="mt-2 text-gray-600">
              Complete mathematical information by filling in response boxes on interactive images.
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
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Instructions</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Analyze the image carefully</li>
                <li>• Fill in the input boxes with numbers</li>
                <li>• Green border = correct answer</li>
                <li>• Red border = incorrect answer</li>
                <li>• Use the hint if you need help</li>
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

            {/* Image Container with Input Overlays */}
            <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={300}
                  className="border border-gray-300 rounded"
                />
                {renderInputBoxes()}
              </div>
            </div>
          </div>

          {/* Answer Summary */}
          {Object.keys(feedback).length > 0 && (
            <div className="border border-gray-200 bg-white rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Answer Summary:</h4>
              <div className="grid gap-2">
                {currentProblem.inputBoxes.map((box) => {
                  const userAnswer = userAnswers[box.id];
                  const isCorrect = feedback[box.id] === 'correct';
                  const hasAnswer = userAnswer && userAnswer.trim();
                  
                  if (!hasAnswer) return null;
                  
                  return (
                    <div key={box.id} className={`p-2 rounded border ${
                      isCorrect 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      <span className="text-sm">
                        {box.id}: {userAnswer}{box.unit} {isCorrect ? '✓' : '✗'}
                      </span>
                      {!isCorrect && (
                        <div className="text-xs mt-1">
                          Correct answer: {box.answer}{box.unit}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Solution Explanation */}
          {isComplete && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">Great job!</h4>
              <p className="text-sm text-green-600">
                You've successfully completed this problem. Try another one to practice more!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}