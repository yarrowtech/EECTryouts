import { Route, Routes } from "react-router-dom";
import IntermediateRoutes from "./games/intermediate/index.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to the EEC Tryout</h1>} />
      <Route path="/intermediate/*" element={<IntermediateRoutes />} />
    </Routes>
  );
}

export default App;
