import { Route, Routes } from "react-router-dom"
import ClozeDragDrop from "./games/cloze_drag_drop"
import MCQ from "./games/mcq"
import ClozeText from "./games/cloze_text"
import ClozeDropDown from "./games/cloze_drop_down"
import MatchList from "./games/match_list"
import ChoiceMatrix from "./games/choice_matrix"
import SortList from "./games/sort_list"
import FileUpload from "./games/file_upload"
import ImageHighlighter from "./games/image_highlighter"
import RichText from "./games/rich_text"
import TextEditor from "./games/plain_txt"


function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the EEC Tryout</h1>} />
      <Route path="/drag-drop" element={<ClozeDragDrop />} />
      <Route path="/cloze-text" element={<ClozeText />} />
      <Route path="/cloze-drop-down" element={<ClozeDropDown />} />
      <Route path="/match-list" element={<MatchList />} />
      <Route path="/sort-list" element={<SortList />} />
      <Route path="/mcq" element={<MCQ />} />
      <Route path="/rich-text" element={<RichText />} />
      <Route path="/choice-matrix" element={<ChoiceMatrix />} />
      <Route path="/file-upload" element={<FileUpload />} />
      <Route path="/image-highlighter" element={<ImageHighlighter />} />
      <Route path="/text-editor" element={<TextEditor />} />
    </Routes>
  )
}

export default App
