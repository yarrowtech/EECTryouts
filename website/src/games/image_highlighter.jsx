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

  const updateCanvasSize = () => {
    const img = imgRef.current;
    console.log(img);
    clearInterval;
    const canvas = canvasRef.current;
    if (img && canvas) {
      canvas.width = img.width;
      canvas.height = img.height;
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

  const getRelativeCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    isDrawing.current = true;
    currentPath.current = [];
    const { x, y } = getRelativeCoords(e);
    currentPath.current.push({ x, y, color: drawColor });
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const { x, y } = getRelativeCoords(e);
    currentPath.current.push({ x, y, color: drawColor });
    redrawCanvas([...paths, currentPath.current]);
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    setPaths((prev) => {
      const updated = [...prev, currentPath.current];
      setHistory(updated);
      setRedoStack([]); // clear redo stack
      return updated;
    });
  };

  const redrawCanvas = (pathsToDraw) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pathsToDraw.forEach((path) => {
      if (path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = path[0].color;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 1;
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
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
            <img
              ref={imgRef}
              src={image}
              alt="To annotate"
              width={300}
              height={400}
              className="block h-auto"
              onLoad={updateCanvasSize}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
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
