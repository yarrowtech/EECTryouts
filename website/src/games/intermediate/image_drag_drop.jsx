import { useMemo, useState } from "react";

const ANSWER_CHOICES = ["United States", "Brazil", "India", "Australia"];

const ZONES = [
  {
    id: "usa",
    correctAnswer: "United States",
    label: "North America highlight",
    style: {
      top: "25%",
      left: "12%",
      width: "18%",
      height: "20%",
    },
  },
  {
    id: "brazil",
    correctAnswer: "Brazil",
    label: "South America highlight",
    style: {
      top: "65%",
      left: "25%",
      width: "12%",
      height: "15%",
    },
  },
  {
    id: "india",
    correctAnswer: "India",
    label: "South Asia highlight",
    style: {
      top: "40%",
      left: "68%",
      width: "6%",
      height: "12%",
    },
  },
  {
    id: "australia",
    correctAnswer: "Australia",
    label: "Oceania highlight",
    style: {
      top: "75%",
      left: "80%",
      width: "10%",
      height: "12%",
    },
  },
];

const initialBoardState = () => ({
  bank: [...ANSWER_CHOICES],
  assignments: ZONES.reduce(
    (accumulator, zone) => ({
      ...accumulator,
      [zone.id]: null,
    }),
    {}
  ),
});

function parseDragData(event) {
  try {
    const payload = event.dataTransfer.getData("application/json");
    if (!payload) return null;
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getZoneClasses({ showResults, assignedAnswer, correctAnswer, isActive }) {
  const base =
    "absolute flex flex-col items-center justify-center rounded-lg border-2 border-blue-400/70 bg-blue-500/20 backdrop-blur-sm transition shadow-sm";

  const active = isActive ? "ring-2 ring-blue-400/60" : "";

  if (!showResults) {
    return `${base} hover:border-blue-500 hover:bg-blue-400/25 ${active}`;
  }

  if (!assignedAnswer) {
    return `${base} border-yellow-300/80 bg-yellow-100/40 ${active}`;
  }

  if (assignedAnswer === correctAnswer) {
    return `${base} border-green-400/80 bg-green-200/40 ${active}`;
  }

  return `${base} border-red-400/80 bg-red-200/40 ${active}`;
}

function getPointerClasses({ showResults, assignedAnswer, correctAnswer }) {
  let colorClass = "bg-blue-400/60";

  if (showResults) {
    if (!assignedAnswer) {
      colorClass = "bg-yellow-300/70";
    } else if (assignedAnswer === correctAnswer) {
      colorClass = "bg-green-400/70";
    } else {
      colorClass = "bg-red-400/70";
    }
  }

  return [
    "pointer-events-none absolute left-1/2 bottom-0 h-3 w-3 -translate-x-1/2 translate-y-1/2 rotate-45 transition",
    colorClass,
  ].join(" ");
}

export default function ImageDragDropLabeling() {
  const [boardState, setBoardState] = useState(initialBoardState);
  const [draggingId, setDraggingId] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const { bank, assignments } = boardState;

  const score = useMemo(
    () =>
      ZONES.reduce(
        (total, zone) =>
          assignments[zone.id] === zone.correctAnswer ? total + 1 : total,
        0
      ),
    [assignments]
  );

  const handleDragStart = (event, source) => {
    event.dataTransfer.setData("application/json", JSON.stringify(source));
    event.dataTransfer.effectAllowed = "move";
    setDraggingId(source.answer);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const handleDropOnZone = (zoneId) => (event) => {
    event.preventDefault();
    const data = parseDragData(event);
    if (!data || !data.answer) return;

    if (data.type === "zone" && data.zoneId === zoneId) {
      setDraggingId(null);
      return;
    }

    setBoardState((prev) => {
      const nextBank = [...prev.bank];
      const nextAssignments = { ...prev.assignments };

      if (data.type === "bank") {
        const index = nextBank.indexOf(data.answer);
        if (index !== -1) {
          nextBank.splice(index, 1);
        }
      } else if (data.type === "zone") {
        nextAssignments[data.zoneId] = null;
      }

      const displaced = nextAssignments[zoneId];
      if (displaced && displaced !== data.answer) {
        nextBank.push(displaced);
      }

      nextAssignments[zoneId] = data.answer;

      return {
        bank: nextBank,
        assignments: nextAssignments,
      };
    });

    setShowResults(false);
    setDraggingId(null);
  };

  const handleDropToBank = (event) => {
    event.preventDefault();
    const data = parseDragData(event);
    if (!data || data.type !== "zone") return;

    setBoardState((prev) => {
      const nextAssignments = { ...prev.assignments };
      const answer = nextAssignments[data.zoneId];

      if (!answer) {
        return prev;
      }

      nextAssignments[data.zoneId] = null;

      const isDuplicate = prev.bank.includes(answer);
      return {
        bank: isDuplicate ? prev.bank : [...prev.bank, answer],
        assignments: nextAssignments,
      };
    });

    setShowResults(false);
    setDraggingId(null);
  };

  const handleReset = () => {
    setBoardState(initialBoardState());
    setShowResults(false);
    setDraggingId(null);
  };

  const handleRemoveAssignment = (zoneId) => {
    setBoardState((prev) => {
      const answer = prev.assignments[zoneId];
      if (!answer) {
        return prev;
      }

      const alreadyInBank = prev.bank.includes(answer);

      return {
        bank: alreadyInBank ? prev.bank : [...prev.bank, answer],
        assignments: {
          ...prev.assignments,
          [zoneId]: null,
        },
      };
    });
    setShowResults(false);
    setDraggingId(null);
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-purple-700">
          Map Drag Drop
        </h1>
        <p className="mt-2 text-gray-700">
          Drag the country names onto the highlighted regions on the map. The pointer shows which country each box represents. Drop an answer back into the bank or use the × button to remove it.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-200 bg-blue-50 shadow-inner">
          <img
            src="/world-map.png"
            alt="World map with highlighted regions"
            className="block w-full select-none"
            draggable={false}
          />

          {ZONES.map((zone) => {
            const assignedAnswer = assignments[zone.id];
            const isDraggingOver = draggingId !== null;

            return (
              <div
                key={zone.id}
                role="button"
                tabIndex={0}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDropOnZone(zone.id)}
                style={zone.style}
                className={getZoneClasses({
                  showResults,
                  assignedAnswer,
                  correctAnswer: zone.correctAnswer,
                  isActive: isDraggingOver,
                })}
              >
                <span className="sr-only">{zone.label}</span>
                <div className="flex grow items-center justify-center px-2">
                  {assignedAnswer ? (
                    <div
                      draggable
                      onDragStart={(event) =>
                        handleDragStart(event, {
                          type: "zone",
                          answer: assignedAnswer,
                          zoneId: zone.id,
                        })
                      }
                      onDragEnd={handleDragEnd}
                      className={[
                        "cursor-move rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 shadow",
                        draggingId === assignedAnswer ? "opacity-50" : "",
                      ].join(" ")}
                    >
                      {assignedAnswer}
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase text-blue-900/70">
                      Drop Here
                    </span>
                  )}
                </div>
                
                {showResults && assignedAnswer && assignedAnswer !== zone.correctAnswer && (
                  <p className="mb-1 rounded bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-600">
                    ✓ {zone.correctAnswer}
                  </p>
                )}
                
                <span
                  className={getPointerClasses({
                    showResults,
                    assignedAnswer,
                    correctAnswer: zone.correctAnswer,
                  })}
                />
                
                {assignedAnswer && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(zone.id)}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-purple-600 shadow transition hover:bg-purple-100"
                    aria-label={`Remove ${assignedAnswer}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDropToBank}
          className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-700">Answer Bank</h2>
            <span className="text-xs font-medium text-purple-500">
              Drag answers to the map
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {bank.map((answer) => (
              <div
                key={answer}
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, {
                    type: "bank",
                    answer,
                  })
                }
                onDragEnd={handleDragEnd}
                className={[
                  "cursor-move rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 shadow transition hover:bg-purple-200",
                  draggingId === answer ? "opacity-50" : "",
                ].join(" ")}
              >
                {answer}
              </div>
            ))}

            {bank.length === 0 && (
              <p className="rounded-lg border border-purple-100 bg-purple-50/80 px-3 py-2 text-xs text-purple-500">
                All answers are placed on the map
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
            Score: {score} / {ZONES.length}
          </span>
        )}
      </footer>
    </div>
  );
}