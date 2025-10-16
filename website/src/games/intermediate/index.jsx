import { Route, Routes, Link } from "react-router-dom";
import WorldMapDrag from "./world_map_drag.jsx";
import MarvelDropDown from "./marvel_drop_down.jsx";
import HemisphereClassification from "./hemisphere_classification.jsx";

const modules = [
  {
    path: "world-map",
    title: "World Map Drag & Drop",
    description:
      "Drag each country label onto the correct location on the map.",
  },
  {
    path: "drop-down",
    title: "Marvel Character Drop Down",
    description:
      "Match each Marvel hero image to the correct name using dropdown menus.",
  },
  {
    path: "classification",
    title: "Hemisphere Classification",
    description:
      "Sort countries into the Northern or Southern Hemisphere using drag and drop.",
  },
];

function IntermediateHome() {
  return (
    <div className="mx-auto mt-12 max-w-4xl space-y-8 rounded-2xl border border-purple-300 bg-white p-8 shadow">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-purple-700">
          Intermediate Games
        </h1>
        <p className="text-gray-600">
          Explore interactive activities that build on the basics. Select a
          module below to get started.
        </p>
      </header>

      {modules.length === 0 ? (
        <section className="rounded-xl border border-dashed border-purple-200 bg-purple-50 px-6 py-8 text-center text-sm text-purple-600">
          No modules have been added yet. Create a component inside{" "}
          <code className="rounded bg-white px-2 py-1 text-xs text-purple-700">
            src/games/intermediate
          </code>{" "}
          and register it in this router to expose a new route.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.path}
              to={`/intermediate/${module.path}`}
              className="group rounded-xl border border-purple-200 bg-purple-50 p-6 text-left transition hover:border-purple-300 hover:bg-purple-100"
            >
              <h2 className="text-lg font-semibold text-purple-700 group-hover:underline">
                {module.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{module.description}</p>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

function IntermediateNotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-3 rounded-2xl border border-purple-300 bg-white px-10 py-8 text-center shadow">
        <h2 className="text-2xl font-semibold text-purple-700">
          Page Missing
        </h2>
        <p className="text-gray-600">
          The requested intermediate activity could not be found.
        </p>
        <Link
          to="/intermediate"
          className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          Back to Intermediate Home
        </Link>
      </div>
    </div>
  );
}

export default function IntermediateRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IntermediateHome />} />
      <Route path="index" element={<IntermediateHome />} />
      <Route path="world-map" element={<WorldMapDrag />} />
      <Route path="drop-down" element={<MarvelDropDown />} />
      <Route path="classification" element={<HemisphereClassification />} />
      <Route path="*" element={<IntermediateNotFound />} />
    </Routes>
  );
}
