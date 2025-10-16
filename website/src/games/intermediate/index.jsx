import { NavLink, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ClozeDragDropPanel from "../../panel/cloze_drag_drop.jsx";
import MCQPanel from "../../panel/mcq.jsx";
import "react-toastify/dist/ReactToastify.css";

const intermediateSections = [
  { path: "mcq", label: "MCQ Builder", element: <MCQPanel /> },
  { path: "drag-drop", label: "Cloze Drag & Drop Builder", element: <ClozeDragDropPanel /> },
];

function IntermediateHome() {
  return (
    <div className="rounded-xl border border-purple-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-purple-700">Welcome to Intermediate Tools</h2>
      <p className="mt-4 text-gray-700">
        Choose a builder from the navigation above to start crafting new questions. Each tool lets you
        compose content and submit it to the backend API.
      </p>
    </div>
  );
}

function NotFoundSection() {
  return (
    <div className="rounded-xl border border-red-200 bg-white p-8 text-red-600 shadow-sm">
      The requested tool could not be found. Select another option from the navigation.
    </div>
  );
}

function Navigation() {
  return (
    <nav className="flex flex-wrap gap-3 border-b border-purple-200 pb-4">
      {intermediateSections.map(({ path, label }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            [
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
              isActive ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200",
            ].join(" ")
          }
          end
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function IntermediateRoutes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <Navigation />
        <Routes>
          <Route index element={<IntermediateHome />} />
          {intermediateSections.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFoundSection />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
