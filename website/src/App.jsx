import { Route, Routes } from "react-router-dom"
import DragDrop from "./games/drag_drop"
import MCQ from "./games/mcq"

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the Game Portal</h1>} />
      <Route path="/drag-drop" element={<DragDrop />} />
      <Route path="/mcq" element={<MCQ />} />
    </Routes>
  )
}

export default App
