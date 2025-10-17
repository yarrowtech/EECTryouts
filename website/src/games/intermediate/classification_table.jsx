import { useMemo, useState } from "react";

const CATEGORIES = ["Northern Hemisphere", "Southern Hemisphere"];
const UNASSIGNED = "Unassigned";

const COUNTRY_ITEMS = [
  { id: "canada", name: "Canada", category: "Northern Hemisphere" },
  { id: "germany", name: "Germany", category: "Northern Hemisphere" },
  { id: "japan", name: "Japan", category: "Northern Hemisphere" },
  { id: "usa", name: "United States", category: "Northern Hemisphere" },
  { id: "france", name: "France", category: "Northern Hemisphere" },
  { id: "australia", name: "Australia", category: "Southern Hemisphere" },
  { id: "brazil", name: "Brazil", category: "Southern Hemisphere" },
  { id: "argentina", name: "Argentina", category: "Southern Hemisphere" },
  { id: "south-africa", name: "South Africa", category: "Southern Hemisphere" },
  { id: "new-zealand", name: "New Zealand", category: "Southern Hemisphere" },
];

const DROP_ZONES = [UNASSIGNED, ...CATEGORIES];

function createInitialAssignments() {
  return COUNTRY_ITEMS.reduce(
    (accumulator, item) => ({
      ...accumulator,
      [item.id]: UNASSIGNED,
    }),
    {}
  );
}

function getCardClasses(showResults, assignments, item) {
  const baseClasses =
    "cursor-move rounded-lg border-2 border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition";

  if (!showResults) {
    return `${baseClasses} hover:border-purple-400 hover:shadow-md`;
  }

  const assignment = assignments[item.id];

  if (assignment === UNASSIGNED) {
    return `${baseClasses} border-yellow-300 bg-yellow-50`;
  }

  if (assignment === item.category) {
    return `${baseClasses} border-green-400 bg-green-50`;
  }

  return `${baseClasses} border-red-400 bg-red-50`;
}

export default function ClassificationTableGame() {
  const [assignments, setAssignments] = useState(() => createInitialAssignments());
  const [showResults, setShowResults] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const groupedItems = useMemo(() => {
    return DROP_ZONES.reduce((accumulator, zone) => {
      accumulator[zone] = COUNTRY_ITEMS.filter((item) => assignments[item.id] === zone);
      return accumulator;
    }, {});
  }, [assignments]);

  const score = useMemo(
    () =>
      COUNTRY_ITEMS.reduce(
        (total, item) =>
          assignments[item.id] === item.category ? total + 1 : total,
        0
      ),
    [assignments]
  );

  const handleDrop = (event, destination) => {
    event.preventDefault();
    const itemId = event.dataTransfer.getData("text/plain");
    if (!itemId) return;

    setAssignments((prev) => {
      if (!prev[itemId] || prev[itemId] === destination) {
        return prev;
      }

      return {
        ...prev,
        [itemId]: destination,
      };
    });
    setShowResults(false);
    setDraggingId(null);
  };

  const handleDragStart = (event, itemId) => {
    event.dataTransfer.setData("text/plain", itemId);
    setDraggingId(itemId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAssignments(createInitialAssignments());
    setShowResults(false);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-6">
      <header className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-purple-700">
          Hemisphere Classification Challenge
        </h1>
        <p className="mt-2 text-gray-700">
          Drag each country card into the correct hemisphere. Check your answers when you&apos;re done to
          see how you performed.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((zone) => {
            const isActive = draggingId !== null;

            return (
              <div
                key={zone}
                className="flex flex-col gap-4 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm"
              >
                <div className="rounded-xl bg-purple-600 px-4 py-3 text-center text-lg font-semibold text-white shadow">
                  {zone}
                </div>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, zone)}
                  className={[
                    "min-h-[260px] rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-4 transition",
                    isActive ? "hover:border-purple-400 hover:bg-purple-100/60" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-purple-500">
                      {groupedItems[zone].length} / {COUNTRY_ITEMS.length}
                    </span>
                    <span className="text-xs text-gray-500">Drop countries below</span>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    {groupedItems[zone].map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(event) => handleDragStart(event, item.id)}
                        onDragEnd={handleDragEnd}
                        className={[
                          getCardClasses(showResults, assignments, item),
                          draggingId === item.id ? "opacity-50" : "",
                        ].join(" ")}
                      >
                        <span>{item.name}</span>
                        {showResults && assignments[item.id] !== item.category && (
                          <p className="mt-1 text-xs font-medium text-red-600">
                            Correct: {item.category}
                          </p>
                        )}
                      </div>
                    ))}

                    {groupedItems[zone].length === 0 && (
                      <p className="rounded-lg border border-purple-100 bg-white px-3 py-2 text-xs text-purple-500">
                        Drop here
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, UNASSIGNED)}
          className="min-h-[180px] rounded-2xl border-2 border-dashed border-purple-200 bg-white p-4 shadow-sm transition hover:border-purple-400 hover:bg-purple-50/40"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-700">Unassigned Countries</h2>
            <span className="text-xs font-medium text-purple-500">
              {groupedItems[UNASSIGNED].length} / {COUNTRY_ITEMS.length}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            {groupedItems[UNASSIGNED].map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(event) => handleDragStart(event, item.id)}
                onDragEnd={handleDragEnd}
                className={[
                  getCardClasses(showResults, assignments, item),
                  draggingId === item.id ? "opacity-50" : "",
                ].join(" ")}
              >
                <span>{item.name}</span>
              </div>
            ))}

            {groupedItems[UNASSIGNED].length === 0 && (
              <p className="rounded-lg border border-purple-100 bg-purple-50/50 px-3 py-2 text-xs text-purple-500">
                All countries are assigned
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleCheckAnswers}
          className="rounded-full bg-purple-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Check Answers
        </button>
        <button
          onClick={handleReset}
          className="rounded-full border border-purple-400 px-6 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
        >
          Reset
        </button>

        {showResults && (
          <span className="ml-auto rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            Score: {score} / {COUNTRY_ITEMS.length}
          </span>
        )}
      </footer>
    </div>
  );
}
