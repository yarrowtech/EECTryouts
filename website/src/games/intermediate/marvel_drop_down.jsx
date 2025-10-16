import { useMemo, useState } from "react";

const characterRows = [
  {
    id: "row-captain-america",
    name: "Captain America",
    image: "/captain-america.jpg",
  },
  {
    id: "row-iron-man",
    name: "Iron Man",
    image: "/iron-man.jpg",
  },
  {
    id: "row-thor",
    name: "Thor",
    image: "/thor.jpg",
  },
];

const options = ["Select a hero", "Captain America", "Iron Man", "Thor"];

export default function MarvelDropDown() {
  const [selections, setSelections] = useState(
    characterRows.reduce((acc, row) => {
      acc[row.id] = options[0];
      return acc;
    }, {})
  );
  const [feedback, setFeedback] = useState(null);

  const completedCount = useMemo(
    () =>
      Object.values(selections).filter((value) => value !== options[0]).length,
    [selections]
  );

  const hasPerfectScore = useMemo(
    () =>
      characterRows.every((row) => selections[row.id] === row.name),
    [selections]
  );

  const handleSelect = (rowId, value) => {
    setSelections((prev) => ({
      ...prev,
      [rowId]: value,
    }));
    setFeedback(null);
  };

  const handleCheck = () => {
    const totalRows = characterRows.length;
    const correct = characterRows.filter(
      (row) => selections[row.id] === row.name
    ).length;

    if (correct === totalRows) {
      setFeedback({
        type: "success",
        message: "Nice work! Every character is matched correctly.",
      });
      return;
    }

    if (completedCount < totalRows) {
      setFeedback({
        type: "info",
        message: `You still have ${
          totalRows - completedCount
        } selection${totalRows - completedCount === 1 ? "" : "s"} to make.`,
      });
    } else {
      setFeedback({
        type: "warning",
        message: `${correct}/${totalRows} are correct. Adjust the mismatched selections and try again.`,
      });
    }
  };

  const handleReset = () => {
    setSelections(
      characterRows.reduce((acc, row) => {
        acc[row.id] = options[0];
        return acc;
      }, {})
    );
    setFeedback(null);
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-8 px-4">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-purple-700">
          Match the Marvel Heroes
        </h1>
        <p className="mt-2 text-gray-600">
          Evaluate each image and select the correct Marvel character from the dropdown.
        </p>
      </header>

      <section className="rounded-2xl border border-purple-300 bg-white p-6 shadow-lg">
        <div className="grid gap-6 md:grid-cols-3">
          {characterRows.map((row) => {
            const selection = selections[row.id];
            const statusClass =
              selection === options[0]
                ? "border-gray-200"
                : selection === row.name || hasPerfectScore
                ? "border-green-400 ring-1 ring-green-300"
                : "border-yellow-400 ring-1 ring-yellow-200";

            return (
              <article
                key={row.id}
                className={`flex flex-col gap-4 rounded-2xl border ${statusClass} bg-purple-50/60 p-4`}
              >
                <div className="overflow-hidden rounded-xl border border-purple-200 bg-black/5 shadow-sm">
                  <img
                    src={row.image}
                    alt={row.name}
                    className="aspect-[4/5] w-full object-contain object-top"
                  />
                </div>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-purple-700">
                    Who is this hero?
                  </span>
                  <span className="text-xs text-gray-500">
                    Look for signature suits, weapons, or colors.
                  </span>
                  <select
                    value={selection}
                    onChange={(event) => handleSelect(row.id, event.target.value)}
                    className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      selection === options[0]
                        ? "border-gray-300 text-gray-500"
                        : selection === row.name || hasPerfectScore
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-yellow-400 bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 pt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-purple-700">{completedCount}</span>{" "}
          of {characterRows.length} selections made.
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

      <p className="text-xs text-gray-500">
        Note: Place the character images in the <code className="rounded bg-gray-100 px-2 py-1 text-[11px] text-purple-700">public/</code> folder with names
        <code className="mx-1 rounded bg-gray-100 px-2 py-1 text-[11px] text-purple-700">captain-america.jpg</code>,
        <code className="mx-1 rounded bg-gray-100 px-2 py-1 text-[11px] text-purple-700">iron-man.jpg</code>, and
        <code className="mx-1 rounded bg-gray-100 px-2 py-1 text-[11px] text-purple-700">thor.jpg</code>.
      </p>
    </div>
  );
}
