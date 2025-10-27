import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ImageLabelDropdown from "./image_label_dropdown.jsx";
import ClassificationTableGame from "./classification_table.jsx";
import ImageDragDropLabeling from "./image_drag_drop.jsx";
import ImageAnnotationUploader from "./image_annotation_uploader.jsx";
import DrawingGame from "./drawing_game.jsx";
import ShadingGame from "./shading.jsx";
import ClozeMathGame from "./cloze_math.jsx";
import MathFormulaGame from "./math_formula.jsx";
import ClozeMathImageGame from "./cloze_math_image.jsx";
import NumberLineDragDropGame from "./number_line_drag_drop.jsx";
import DotLinePlotGame from "./dot_line_plot.jsx";
import GriddedGame from "./gridded.jsx";
import CloseChemistryGame from "./cloze_chemistry.jsx";
import ChemistryFormulaGame from "./chemistry_formula.jsx";
import "react-toastify/dist/ReactToastify.css";

const availableSections = [
  {
    path: "image-labeling",
    label: "Image Label Dropdown",
    element: <ImageLabelDropdown />,
  },
  {
    path: "image-drag-drop",
    label: "Map Drag Drop",
    element: <ImageDragDropLabeling />,
  },
  {
    path: "classification",
    label: "Classification Table",
    element: <ClassificationTableGame />,
  },
  {
    path: "image-annotation",
    label: "Image Annotation Uploader",
    element: <ImageAnnotationUploader />,
  },
  {
    path: "drawing-game",
    label: "Drawing Game",
    element: <DrawingGame />,
  },
  {
    path: "shading",
    label: "Shading Game",
    element: <ShadingGame />,
  },
  {
    path: "cloze-math",
    label: "Cloze Math",
    element: <ClozeMathGame />,
  },
  {
    path: "math-formula",
    label: "Math Formula",
    element: <MathFormulaGame />,
  },
  {
    path: "cloze-math-image",
    label: "Cloze Math with Image",
    element: <ClozeMathImageGame />,
  },
  {
    path: "number-line-drag-drop",
    label: "Number Line Drag & Drop",
    element: <NumberLineDragDropGame />,
  },
  {
    path: "dot-line-plot",
    label: "Dot Plot / Line Plot",
    element: <DotLinePlotGame />,
  },
  {
    path: "gridded",
    label: "Gridded Response",
    element: <GriddedGame />,
  },
  {
    path: "cloze-chemistry",
    label: "Cloze Chemistry",
    element: <CloseChemistryGame />,
  },
  {
    path: "chemistry-formula",
    label: "Chemistry Formula",
    element: <ChemistryFormulaGame />,
  },
];

const upcomingSections = [
  { label: "Coming Soon: Science Sorting Lab" },
  { label: "Coming Soon: Timeline Sequencer" },
];

function IntermediateHome() {
  return (
    <div className="rounded-xl border border-purple-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-purple-700">Welcome to Intermediate Tools</h2>
      <p className="mt-4 text-gray-700">
        Use the dropdown above to try the image labeling activities, test the annotation uploader, or practice
        the hemisphere classification challenge. Each tool lets you compose content and submit it to the backend
        API.
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
    <DropdownNavigation />
  );
}

function DropdownNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = (() => {
    if (!location.pathname.startsWith("/intermediate")) {
      return "";
    }
    const segment = location.pathname.replace("/intermediate", "").replace(/^\//, "");
    return availableSections.some((section) => section.path === segment) ? segment : "";
  })();

  const handleChange = (event) => {
    const nextPath = event.target.value;
    if (!nextPath) {
      navigate("/intermediate");
      return;
    }
    navigate(`/intermediate/${nextPath}`);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-purple-200 bg-white p-4 shadow-sm">
      <label htmlFor="intermediate-tool-selector" className="text-sm font-semibold text-purple-700">
        Select a tool
      </label>
      <select
        id="intermediate-tool-selector"
        value={activePath}
        onChange={handleChange}
        className="rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
      >
        <option value="">Home</option>
        <optgroup label="Available games">
          {availableSections.map(({ path, label }) => (
            <option key={path} value={path}>
              {label}
            </option>
          ))}
        </optgroup>
        <optgroup label="Upcoming games">
          {upcomingSections.map(({ label }) => (
            <option key={label} value="" disabled>
              {label}
            </option>
          ))}
        </optgroup>
      </select>
    </div>
  );
}

export default function IntermediateRoutes() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        <Navigation />
        <Routes>
          <Route index element={<IntermediateHome />} />
          {availableSections.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFoundSection />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
