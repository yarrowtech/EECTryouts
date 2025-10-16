import { useMemo, useState } from "react";

const categories = [
  {
    id: "northern",
    title: "Northern Hemisphere",
    description: "Countries primarily north of the equator.",
  },
  {
    id: "southern",
    title: "Southern Hemisphere",
    description: "Countries primarily south of the equator.",
  },
];

const countryList = [
  {
    id: "iceland",
    name: "Iceland",
    correct: "northern",
    clue: "North Atlantic island nation at high latitude.",
  },
  {
    id: "zimbabwe",
    name: "Zimbabwe",
    correct: "southern",
    clue: "Landlocked African country south of the equator.",
  },
  {
    id: "argentina",
    name: "Argentina",
    correct: "southern",
    clue: "South American nation stretching toward the subantarctic.",
  },
  {
    id: "germany",
    name: "Germany",
    correct: "northern",
    clue: "Central European country around 50°N latitude.",
  },
];

const getInitialAssignments = () =>
  categories.reduce((acc, category) => {
    acc[category.id] = [];
    return acc;
  }, {});

export default function HemisphereClassification() {
  const [available, setAvailable] = useState(countryList);
  const [assignments, setAssignments] = useState(getInitialAssignments);
  const [feedback, setFeedback] = useState(null);

  const totalCountries = countryList.length;
  const placedCount = useMemo(
    () => categories.reduce((sum, category) => sum + assignments[category.id].length, 0),
    [assignments]
  );

  const handleDragStart = (event, countryId) => {
    event.dataTransfer.setData("text/plain", countryId);
    event.dataTransfer.effectAllowed = "move";
    setFeedback(null);
  };

  const handleDrop = (event, categoryId) => {
    event.preventDefault();
    const countryId = event.dataTransfer.getData("text/plain");
    if (!countryId) return;

    const fromAvailable = available.find((country) => country.id === countryId);
    let movingCountry = fromAvailable;
    let nextAvailable = available;
    const nextAssignments = { ...assignments };

    if (!movingCountry) {
      const sourceCategory = categories.find((category) =>
        assignments[category.id].some((country) => country.id === countryId)
      );
      if (!sourceCategory) return;
      movingCountry = assignments[sourceCategory.id].find((country) => country.id === countryId);
      nextAssignments[sourceCategory.id] = assignments[sourceCategory.id].filter(
        (country) => country.id !== countryId
      );
    } else {
      nextAvailable = available.filter((country) => country.id !== countryId);
    }

    if (!movingCountry) return;

    nextAssignments[categoryId] = [
      ...nextAssignments[categoryId].filter((country) => country.id !== countryId),
      movingCountry,
    ];

    setAssignments(nextAssignments);
    setAvailable(nextAvailable);
  };

  const handleReturn = (countryId) => {
    const sourceCategory = categories.find((category) =>
      assignments[category.id].some((country) => country.id === countryId)
    );
    if (!sourceCategory) return;

    const nextAssignments = { ...assignments };
    const country = nextAssignments[sourceCategory.id].find((item) => item.id === countryId);
    nextAssignments[sourceCategory.id] = nextAssignments[sourceCategory.id].filter(
      (item) => item.id !== countryId
    );

    setAssignments(nextAssignments);
    setAvailable((prev) =>
      [...prev, country].sort((a, b) => a.name.localeCompare(b.name))
    );
    setFeedback(null);
  };

  const handleCheck = () => {
    const totalPlaced = categories.reduce((sum, category) => sum + assignments[category.id].length, 0);
    const correct = categories.reduce((sum, category) => {
      return (
        sum +
        assignments[category.id].filter((country) => country.correct === category.id).length
      );
    }, 0);

    if (totalPlaced < totalCountries) {
      setFeedback({
        type: "info",
        message: `Place all countries before checking. You still have ${
          totalCountries - totalPlaced
        } item${totalCountries - totalPlaced === 1 ? "" : "s"} left.`,
      });
      return;
    }

    if (correct === totalCountries) {
      setFeedback({
        type: "success",
        message: "Excellent! All countries are sorted into the correct hemisphere.",
      });
    } else {
      setFeedback({
        type: "warning",
        message: `${correct}/${totalCountries} are correct. Review the mismatches and adjust.`,
      });
    }
  };

  const handleReset = () => {
    setAvailable(countryList);
    setAssignments(getInitialAssignments());
    setFeedback(null);
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-8 px-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-purple-700">
          Classify Countries by Hemisphere
        </h1>
        <p className="mt-2 text-gray-600">
          Drag each country card into the correct hemisphere. Use the hints when you need a reminder.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-purple-300 bg-white p-5 shadow-sm"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, category.id)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-purple-700">{category.title}</h2>
              <span className="text-xs font-medium text-purple-500">
                {assignments[category.id].length} placed
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{category.description}</p>
            <div className="mt-3 space-y-2">
              {assignments[category.id].length === 0 ? (
                <p className="rounded-lg border border-dashed border-purple-200 bg-purple-50/70 px-3 py-4 text-center text-sm text-gray-500">
                  Drop countries here
                </p>
              ) : (
                assignments[category.id].map((country) => (
                  <div
                    key={country.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium ${
                      country.correct === category.id
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-yellow-200 bg-yellow-50 text-yellow-700"
                    }`}
                    draggable
                    onDragStart={(event) => handleDragStart(event, country.id)}
                    title={country.clue}
                  >
                    <span>{country.name}</span>
                    <button
                      onClick={() => handleReturn(country.id)}
                      className="text-xs font-semibold text-purple-600 underline transition hover:text-purple-800"
                    >
                      Return
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-purple-700">Country Bank</h2>
        <p className="text-sm text-gray-600">
          Drag each country into the correct hemisphere above. You can drag them back here if needed.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {available.length === 0 ? (
            <p className="text-sm text-gray-500">All countries have been placed.</p>
          ) : (
            available.map((country) => (
              <button
                key={country.id}
                draggable
                onDragStart={(event) => handleDragStart(event, country.id)}
                className="flex items-center gap-2 rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm transition hover:border-purple-400 hover:bg-purple-50 active:cursor-grabbing"
                title={country.clue}
              >
                <span>{country.name}</span>
              </button>
            ))
          )}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 pt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-purple-700">{placedCount}</span> of {totalCountries} placed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleCheck}
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700"
          >
            Check Answers
          </button>
        </div>
      </footer>

      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-300 bg-green-50 text-green-700"
              : feedback.type === "warning"
              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
