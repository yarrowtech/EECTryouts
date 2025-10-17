import React, { useState, useRef, useEffect } from "react";

function ImageHighlighter() {
  const [image, setImage] = useState(null);
  const [drawColor, setDrawColor] = useState("#22c55e"); // Green
  const [history, setHistory] = useState([]); // store strokes
  const [redoStack, setRedoStack] = useState([]);
  const [paths, setPaths] = useState([]);

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);
  const lineStartRef = useRef(null);

  const updateCanvasSize = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const { naturalWidth, naturalHeight } = img;
    const { width: displayWidth, height: displayHeight } = img.getBoundingClientRect();

    // Ensure drawing coordinates operate in natural image resolution
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    // Match the displayed size so pointer math lines up with drawing surface
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Redraw existing paths after resizing
    if (paths.length > 0) {
      redrawCanvas(paths);
    }
  };

  useEffect(() => {
    if (image && imgRef.current) {
      imgRef.current.onload = () => {
        updateCanvasSize();
      };
    }
  }, [image]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image")) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const getRelativeCoords = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const point = event.touches?.[0] || event.changedTouches?.[0] || event;

    // Scale coordinates to the canvas's internal resolution
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: x * scaleX,
      y: y * scaleY,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const coords = getRelativeCoords(event);
    if (!coords) return;

    isDrawing.current = true;
    lineStartRef.current = { ...coords, color: drawColor };
    currentPath.current = [{ ...coords, color: drawColor }];
  };

  const draw = (event) => {
    if (!isDrawing.current) return;
    event.preventDefault();
    const coords = getRelativeCoords(event);
    if (!coords) return;

    const startPoint = lineStartRef.current;
    if (!startPoint) return;

    currentPath.current = [
      { ...startPoint },
      { ...coords, color: drawColor },
    ];

    redrawCanvas([...paths, currentPath.current]);
  };

  const finalizeCurrentPath = () => {
    const path = currentPath.current;
    if (!path || path.length === 0) return;

    setPaths((prev) => {
      const pathCopy = path.map((point) => ({ ...point }));
      const updated = [...prev, pathCopy];
      setHistory(updated);
      setRedoStack([]);
      redrawCanvas(updated);
      return updated;
    });
  };

  const stopDrawing = (event) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const start = lineStartRef.current;
    if (start) {
      const coords = event ? getRelativeCoords(event) : null;
      if (coords) {
        currentPath.current = [
          { ...start },
          { ...coords, color: drawColor },
        ];
      } else if (currentPath.current.length === 1) {
        currentPath.current = [
          { ...start },
          { ...start },
        ];
      }
    }
    finalizeCurrentPath();
    lineStartRef.current = null;
  };

  const redrawCanvas = (pathsToDraw) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pathsToDraw.forEach((path) => {
      if (!path || path.length === 0) return;
      const [{ color }] = path;
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 1;

      if (path.length === 1) {
        // Render single clicks as dots
        const [{ x, y }] = path;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        return;
      }

      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    });
  };

  const undo = () => {
    if (paths.length === 0) return;
    const newPaths = [...paths];
    const popped = newPaths.pop();
    setPaths(newPaths);
    setRedoStack((prev) => [...prev, popped]);
    setHistory(newPaths);
    redrawCanvas(newPaths);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const newRedo = [...redoStack];
    const restored = newRedo.pop();
    const newPaths = [...paths, restored];
    setPaths(newPaths);
    setRedoStack(newRedo);
    setHistory(newPaths);
    redrawCanvas(newPaths);
  };

  const clearDrawing = () => {
    setPaths([]);
    setHistory([]);
    setRedoStack([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = document.createElement("canvas");
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      ctx.drawImage(canvasRef.current, 0, 0);
      const link = document.createElement("a");
      link.download = "highlighted-image.png";
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  return (
    <div className="max-w-lg mx-auto mt-5 bg-white p-8 rounded-xl shadow-md border border-purple-300">
      <h2 className="text-3xl font-bold text-purple-700 text-center mb-6">
        Student Image Highlighter
      </h2>

      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full max-w-sm text-sm border rounded-md file:bg-purple-600 file:text-white file:px-4 file:py-2 file:border-0 file:rounded-lg file:cursor-pointer hover:file:bg-purple-700"
        />

        <div className="text-center">
          <p className="text-black text-lg font-semibold">Draw on the image:</p>
          <p>
            <span className="text-green-600 font-medium">Green</span> = Healthy,
            <span className="text-red-600 font-medium ml-2">Red</span> =
            Unhealthy
          </p>
        </div>

        {image && (
          <div className="flex gap-4">
            <button
              onClick={() => setDrawColor("#22c55e")}
              className={`px-4 py-2 rounded ${
                drawColor === "#22c55e"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              ✅ Green
            </button>
            <button
              onClick={() => setDrawColor("#ef4444")}
              className={`px-4 py-2 rounded ${
                drawColor === "#ef4444"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              ❌ Red
            </button>
          </div>
        )}

        {/* Image and Drawing Canvas */}
        {image && (
          <div className="relative border-2 border-purple-400 rounded-xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {/* Sync overlay size with canvas/image */}
            </div>
            <img
              ref={imgRef}
              src={image}
              alt="To annotate"
              className="block max-h-[70vh] w-auto max-w-full"
              onLoad={updateCanvasSize}
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={(event) => stopDrawing(event)}
              onMouseLeave={(event) => stopDrawing(event)}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={(event) => stopDrawing(event)}
              onTouchCancel={(event) => stopDrawing(event)}
            />
          </div>
        )}

        {/* Controls */}
        {image && (
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={undo}
              className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 rounded shadow"
            >
              ↩️ Undo
            </button>
            <button
              onClick={redo}
              className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 rounded shadow"
            >
              ↪️ Redo
            </button>
            <button
              onClick={clearDrawing}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
            >
              🧽 Clear
            </button>
            <button
              onClick={saveDrawing}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded shadow"
            >
              💾 Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageHighlighter;
