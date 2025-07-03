import { Route, Routes } from "react-router-dom"
import ClozeDragDrop from "./games/cloze_drag_drop"
import MCQ from "./games/mcq"
import ClozeText from "./games/cloze_text"
import ClozeDropDown from "./games/cloze_drop_down"
import MatchList from "./games/match_list"
import ChoiceMatrix from "./games/choice_matrix"


function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the Game Portal</h1>} />
      <Route path="/drag-drop" element={<ClozeDragDrop />} />
      <Route path="/cloze-text" element={<ClozeText />} />
      <Route path="/cloze-drop-down" element={<ClozeDropDown />} />
      <Route path="/match-list" element={<MatchList />} />
      <Route path="/mcq" element={<MCQ />} />
      <Route path="/choice-matrix" element={<ChoiceMatrix />} />
    </Routes>
  )
}

export default App
