import { Route, Routes } from "react-router-dom"
import DragDrop from "./games/drag_drop"
import MCQ from "./games/mcq"
import ClozeText from "./games/cloze_text"
import ClozeDropDown from "./games/cloze_drop_down"

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the Game Portal</h1>} />
      <Route path="/drag-drop" element={<DragDrop />} />
      <Route path="/cloze-text" element={<ClozeText />} />
      <Route path="/cloze-drop-down" element={<ClozeDropDown />} />
      <Route path="/mcq" element={<MCQ />} />
    </Routes>
  )
}

export default App
