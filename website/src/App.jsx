import { Route, Routes } from "react-router-dom"
import ClozeDragDrop from "./games/cloze_drag_drop"
import MCQ from "./games/mcq"
import ClozeText from "./games/cloze_text"
import ClozeDropDown from "./games/cloze_drop_down"
import MatchList from "./games/match_list"
import ChoiceMatrix from "./games/choice_matrix"
import FileUpload from "./games/file_upload"
import ImageHighlighter from "./games/image_highlighter"


function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the EEC Tryout</h1>} />
      <Route path="/drag-drop" element={<ClozeDragDrop />} />
      <Route path="/cloze-text" element={<ClozeText />} />
      <Route path="/cloze-drop-down" element={<ClozeDropDown />} />
      <Route path="/match-list" element={<MatchList />} />
      <Route path="/mcq" element={<MCQ />} />
      <Route path="/choice-matrix" element={<ChoiceMatrix />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/image-highlighter" element={<ImageHighlighter />} />
    </Routes>
  )
}

export default App
