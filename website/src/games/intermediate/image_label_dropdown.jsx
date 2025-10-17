import { useMemo, useState } from "react";

const HERO_DATA = [
  {
    id: "cap",
    fileName: "captain america.jpg",
    prompt: "Who is this Avenger?",
    answer: "Captain America",
  },
  {
    id: "iron-man",
    fileName: "iron man.jpg",
    prompt: "Name the hero in red and gold.",
    answer: "Iron Man",
  },
  {
    id: "thor",
    fileName: "thor.jpg",
    prompt: "Pick the correct name for this Asgardian.",
    answer: "Thor",
  },
];

function buildImageSrc(fileName) {
  return `/${encodeURIComponent(fileName)}`;
}

export default function ImageLabelDropdown() {
  const answerOptions = useMemo(
    () => Array.from(new Set(HERO_DATA.map((hero) => hero.answer))),
    []
  );

  const [responses, setResponses] = useState(() =>
    HERO_DATA.reduce(
      (acc, { id }) => ({
        ...acc,
        [id]: "",
      }),
      {}
    )
  );
  const [showResults, setShowResults] = useState(false);

  const handleChange = (heroId, value) => {
    setShowResults(false);
    setResponses((prev) => ({
      ...prev,
      [heroId]: value,
    }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setResponses(
      HERO_DATA.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: "",
        }),
        {}
      )
    );
    setShowResults(false);
  };

  const score = useMemo(
    () =>
      HERO_DATA.reduce(
        (acc, hero) =>
          responses[hero.id] === hero.answer ? acc + 1 : acc,
        0
      ),
    [responses]
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 py-6">
      <header className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-purple-700">
          <span>Label the Avengers</span>
        </h1>
        <p className="mt-2 text-gray-700">
          Look at each hero and pick the correct name from the dropdown. All
          images are served from the project&apos;s public folder.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {HERO_DATA.map((hero) => {
          const selected = responses[hero.id];
          const isCorrect = selected === hero.answer;

          return (
            <article
              key={hero.id}
              className="flex flex-col gap-4 rounded-xl border border-purple-200 bg-white p-4 shadow-sm"
            >
              <div className="flex h-56 items-center justify-center overflow-hidden rounded-lg border border-purple-100 bg-purple-50">
                <img
                  src={buildImageSrc(hero.fileName)}
                  alt={hero.answer}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h2 className="text-lg font-semibold text-purple-700">
                {hero.prompt}
              </h2>

              <select
                value={selected}
                onChange={(event) => handleChange(hero.id, event.target.value)}
                className="rounded-lg border border-purple-300 bg-white p-2 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Select a hero</option>
                {answerOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {showResults && (
                <p
                  className={
                    isCorrect
                      ? "rounded-lg bg-green-50 p-2 text-sm font-semibold text-green-600"
                      : "rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-600"
                  }
                >
                  {isCorrect ? "Correct!" : `Correct answer: ${hero.answer}`}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <footer className="flex flex-wrap gap-3">
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
            Score: {score} / {HERO_DATA.length}
          </span>
        )}
      </footer>
    </div>
  );
}
