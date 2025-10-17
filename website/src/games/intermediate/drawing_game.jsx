import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const SAMPLE_PROBLEMS = [
  { id: "bisect-angle", title: "Angle Bisector", description: "Use compass and straightedge to bisect the given angle.", backgroundImage: null, instructions: "1. Place compass at vertex A\n2. Draw an arc intersecting both rays\n3. From intersection points, draw equal arcs\n4. Connect vertex to arc intersection" },
  { id: "perpendicular-bisector", title: "Perpendicular Bisector", description: "Construct the perpendicular bisector of the line segment.", backgroundImage: null, instructions: "1. Set compass to more than half the segment length\n2. Draw arcs from both endpoints\n3. Connect the two intersection points" },
  { id: "parallel-lines", title: "Parallel Lines", description: "Construct a line parallel to the given line through point P.", backgroundImage: null, instructions: "1. Draw a transversal through P and the given line\n2. Copy the angle using compass\n3. Draw the parallel line" }
];

const TOOLS = {
  PEN: "pen",
  COMPASS: "compass",
  STRAIGHTEDGE: "straightedge",
  ERASER: "eraser",
};

export default function DrawingGame() {
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState(TOOLS.PEN);
  const [currentProblem, setCurrentProblem] = useState(SAMPLE_PROBLEMS[0]);
  const [strokeColor, setStrokeColor] = useState("#2563eb");
  const [strokeWidth, setStrokeWidth] = useState(2);

  // Compass
  const [compassCenter, setCompassCenter] = useState(null);
  const [isSettingCompass, setIsSettingCompass] = useState(false);
  const [compassAngle, setCompassAngle] = useState(90); // Default 90 degrees

  // Straightedge
  const [straightedgeStart, setStraightedgeStart] = useState(null);
  const [mousePos, setMousePos] = useState(null);

  /** --------- Responsive canvas sizing ---------- */
  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;
  const aspect = BASE_WIDTH / BASE_HEIGHT;

  const resizeCanvasToContainer = () => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    if (!canvas || !wrap) return;

    const wrapRect = wrap.getBoundingClientRect();

    // Fit canvas to container while preserving aspect ratio
    let cssWidth = wrapRect.width;
    let cssHeight = cssWidth / aspect;
    if (cssHeight > wrapRect.height) {
      cssHeight = wrapRect.height;
      cssWidth = cssHeight * aspect;
    }

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    // Internal bitmap scale for crisp lines on HiDPI
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing space to CSS pixels

    // Clear + redraw base
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    drawGrid(ctx, cssWidth, cssHeight);
    drawProblemSetup(ctx, cssWidth, cssHeight);
  };

  useEffect(() => {
    resizeCanvasToContainer();
    window.addEventListener("resize", resizeCanvasToContainer);
    return () => window.removeEventListener("resize", resizeCanvasToContainer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw when problem changes
  useEffect(() => {
    resizeCanvasToContainer();
    // Reset tool states when switching problems
    setIsSettingCompass(false);
    setCompassCenter(null);
    setStraightedgeStart(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProblem]);

  const drawGrid = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = "#f3f4f6";
    ctx.lineWidth = 1;

    const step = 20 * (w / BASE_WIDTH); // scale grid spacing with size
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  };

  const drawProblemSetup = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;

    // Scale original coordinates (800x600) into current size
    const sx = (x) => (x / BASE_WIDTH) * w;
    const sy = (y) => (y / BASE_HEIGHT) * h;

    ctx.beginPath();
    switch (currentProblem.id) {
      case "bisect-angle":
        ctx.moveTo(sx(400), sy(300));
        ctx.lineTo(sx(300, w), sy(200));
        ctx.moveTo(sx(400), sy(300));
        ctx.lineTo(sx(500), sy(250));
        ctx.stroke();

        ctx.fillStyle = "#374151";
        ctx.font = `${Math.max(12, (16 * w) / BASE_WIDTH)}px sans-serif`;
        ctx.fillText("A", sx(405), sy(315));
        break;

      case "perpendicular-bisector":
        ctx.moveTo(sx(300), sy(300));
        ctx.lineTo(sx(500), sy(300));
        ctx.stroke();

        ctx.fillStyle = "#374151";
        ctx.font = `${Math.max(12, (16 * w) / BASE_WIDTH)}px sans-serif`;
        ctx.fillText("B", sx(285), sy(295));
        ctx.fillText("C", sx(505), sy(295));
        break;

      case "parallel-lines":
        ctx.moveTo(sx(200), sy(400));
        ctx.lineTo(sx(600), sy(400));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sx(400), sy(200), Math.max(2, (4 * w) / BASE_WIDTH), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#374151";
        ctx.font = `${Math.max(12, (16 * w) / BASE_WIDTH)}px sans-serif`;
        ctx.fillText("P", sx(405), sy(195));
        break;
    }
    ctx.restore();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const getRelativeMousePos = (e) => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const pos = getMousePos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setIsDrawing(true);

    switch (currentTool) {
      case TOOLS.PEN:
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        break;

      case TOOLS.COMPASS:
        if (!isSettingCompass) {
          setCompassCenter(pos);
          setIsSettingCompass(true);
        } else {
          const r = Math.hypot(pos.x - compassCenter.x, pos.y - compassCenter.y);
          const startAngle = Math.atan2(pos.y - compassCenter.y, pos.x - compassCenter.x);
          const endAngle = startAngle + (compassAngle * Math.PI) / 180; // Convert degrees to radians
          
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.beginPath();
          ctx.arc(compassCenter.x, compassCenter.y, r, startAngle, endAngle);
          ctx.stroke();

          setIsSettingCompass(false);
          setCompassCenter(null);
        }
        break;

      case TOOLS.STRAIGHTEDGE:
        if (!straightedgeStart) {
          const relativePos = getRelativeMousePos(e);
          setStraightedgeStart({ canvas: pos, relative: relativePos });
        } else {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth;
          ctx.beginPath();
          ctx.moveTo(straightedgeStart.canvas.x, straightedgeStart.canvas.y);
          ctx.lineTo(pos.x, pos.y);
          ctx.stroke();

          setStraightedgeStart(null);
        }
        break;

      case TOOLS.ERASER:
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        break;
    }
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);
    const relativePos = getRelativeMousePos(e);
    setMousePos(relativePos);

    if (!isDrawing && currentTool !== TOOLS.COMPASS && currentTool !== TOOLS.STRAIGHTEDGE) return;

    e.preventDefault();
    e.stopPropagation();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (currentTool === TOOLS.PEN && isDrawing) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "source-over";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (currentTool === TOOLS.ERASER && isDrawing) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    } else if (currentTool === TOOLS.STRAIGHTEDGE && straightedgeStart && mousePos) {
      // Redraw the canvas and add preview line
      resizeCanvasToContainer();
      
      // Draw preview line
      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.setLineDash([5, 5]); // Dashed line for preview
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(straightedgeStart.canvas.x, straightedgeStart.canvas.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.restore();
    }
  };

  const handleMouseUp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, rect.width, rect.height);
    drawGrid(ctx, rect.width, rect.height);
    drawProblemSetup(ctx, rect.width, rect.height);

    setIsSettingCompass(false);
    setCompassCenter(null);
    setStraightedgeStart(null);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `geometry-solution-${currentProblem.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success("Drawing saved successfully!");
  };

  const getToolIcon = (tool) => {
    switch (tool) {
      case TOOLS.PEN:
        return "✏️";
      case TOOLS.COMPASS:
        return "📐";
      case TOOLS.STRAIGHTEDGE:
        return "📏";
      case TOOLS.ERASER:
        return "🧽";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-7xl gap-0 lg:gap-4 px-3 py-4">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 border border-purple-200/70 bg-white/70 backdrop-blur rounded-xl p-4">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-purple-700">Drawing Game</h1>
            <p className="mt-1 text-sm text-gray-700">
              Solve geometry problems using compass and straightedge tools.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-purple-200 rounded-lg p-3">
              <h2 className="text-sm font-semibold text-purple-700 mb-2">Select Problem</h2>
              <select
                value={currentProblem.id}
                onChange={(e) =>
                  setCurrentProblem(SAMPLE_PROBLEMS.find((p) => p.id === e.target.value))
                }
                className="w-full rounded border border-purple-300 bg-purple-50 px-2 py-1 text-xs text-purple-700 outline-none focus:border-purple-500 focus:bg-white"
              >
                {SAMPLE_PROBLEMS.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-purple-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-purple-700 mb-1">
                {currentProblem.title}
              </h3>
              <p className="text-xs text-gray-700 mb-2">{currentProblem.description}</p>
              <div className="text-xs text-gray-600">
                <strong>Instructions:</strong>
                <pre className="mt-1 whitespace-pre-wrap text-xs">
                  {currentProblem.instructions}
                </pre>
              </div>
            </div>

            <div className="border border-purple-200 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-purple-700 mb-2">Drawing Tools</h3>
              <div className="grid grid-cols-2 gap-1 mb-3">
                {Object.values(TOOLS).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => {
                      setCurrentTool(tool);
                      setIsSettingCompass(false);
                      setStraightedgeStart(null);
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition ${
                      currentTool === tool
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    {getToolIcon(tool)} {tool.charAt(0).toUpperCase() + tool.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="w-full h-6 rounded border border-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Width: {strokeWidth}px
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Compass Angle: {compassAngle}°
                  </label>
                  <select
                    value={compassAngle}
                    onChange={(e) => setCompassAngle(parseInt(e.target.value))}
                    className="w-full rounded border border-purple-300 bg-purple-50 px-2 py-1 text-xs text-purple-700 outline-none focus:border-purple-500 focus:bg-white"
                  >
                    <option value={30}>30°</option>
                    <option value={45}>45°</option>
                    <option value={60}>60°</option>
                    <option value={90}>90°</option>
                    <option value={120}>120°</option>
                    <option value={180}>180° (Half Circle)</option>
                    <option value={360}>360° (Full Circle)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col gap-3">
          <div className="border border-purple-200 bg-white/70 backdrop-blur rounded-xl p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-purple-700">Drawing Canvas</h3>
              <div className="flex gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                >
                  Clear
                </button>
                <button
                  onClick={saveDrawing}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition"
                >
                  Save
                </button>
              </div>
            </div>

            {isSettingCompass && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700">
                  {isSettingCompass && `Click to set compass center, then click again to draw ${compassAngle}° arc`}
                </p>
              </div>
            )}
          </div>

          {/* Canvas wrapper keeps aspect & prevents overflow */}
          <div
            ref={canvasWrapRef}
            className="relative w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
            style={{
              // Let the page scroll naturally; this box grows with content
              // Give the canvas a nice, visible height on typical screens
              minHeight: "420px",
              // Cap height to viewport minus some header padding; page will scroll if smaller
              maxHeight: "calc(100vh - 220px)",
            }}
          >
            <div className="w-full">
              <div className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`block mx-auto rounded-lg border border-gray-300 select-none touch-none ${
                    currentTool === TOOLS.STRAIGHTEDGE ? 'cursor-none' : 'cursor-crosshair'
                  }`}
                  style={{
                    display: "block",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                
                {/* Custom + cursor for straightedge */}
                {currentTool === TOOLS.STRAIGHTEDGE && mousePos && (
                  <div
                    className="absolute pointer-events-none text-purple-600 font-bold text-lg"
                    style={{
                      left: mousePos.x - 8,
                      top: mousePos.y - 12,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    +
                  </div>
                )}
                
                {/* Start point indicator for straightedge */}
                {currentTool === TOOLS.STRAIGHTEDGE && straightedgeStart && (
                  <div
                    className="absolute pointer-events-none w-2 h-2 bg-purple-600 rounded-full"
                    style={{
                      left: straightedgeStart.relative.x - 4,
                      top: straightedgeStart.relative.y - 4,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}