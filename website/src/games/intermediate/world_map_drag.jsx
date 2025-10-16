import { useMemo, useState } from "react";

const sourceLabels = [
  {
    id: "label-canada",
    text: "Canada",
    matches: "zone-canada",
    helper: "Second-largest country spanning much of North America.",
  },
  {
    id: "label-brazil",
    text: "Brazil",
    matches: "zone-brazil",
    helper: "Largest country in South America, home to the Amazon rainforest.",
  },
  {
    id: "label-egypt",
    text: "Egypt",
    matches: "zone-egypt",
    helper: "Northeast African nation along the Nile River.",
  },
  {
    id: "label-india",
    text: "India",
    matches: "zone-india",
    helper: "South Asian country bordered by the Himalayas and Indian Ocean.",
  },
  {
    id: "label-australia",
    text: "Australia",
    matches: "zone-australia",
    helper: "Island continent in the Southern Hemisphere.",
  },
];

const targetZones = [
  {
    id: "zone-canada",
    label: "Canada",
    top: "26%",
    left: "24%",
  },
  {
    id: "zone-brazil",
    label: "Brazil",
    top: "62%",
    left: "36%",
  },
  {
    id: "zone-egypt",
    label: "Egypt",
    top: "45%",
    left: "46%",
  },
  {
    id: "zone-india",
    label: "India",
    top: "52%",
    left: "59%",
  },
  {
    id: "zone-australia",
    label: "Australia",
    top: "78%",
    left: "78%",
  },
];

function computeAssignedMap() {
  return targetZones.reduce((acc, zone) => {
    acc[zone.id] = null;
    return acc;
  }, {});
}

export default function WorldMapDrag() {
  const [assigned, setAssigned] = useState(() => computeAssignedMap());
  const [available, setAvailable] = useState(sourceLabels);
  const [feedback, setFeedback] = useState(null);

  const completedCount = useMemo(
    () => Object.values(assigned).filter(Boolean).length,
    [assigned]
  );

  const handleDragStart = (event, labelId) => {
    event.dataTransfer.setData("text/plain", labelId);
    event.dataTransfer.effectAllowed = "move";
    setFeedback(null);
  };

  const handleDrop = (event, zoneId) => {
    event.preventDefault();
    const labelId = event.dataTransfer.getData("text/plain");
    if (!labelId) return;

    const label = sourceLabels.find((item) => item.id === labelId);
    if (!label) return;

    const occupyingLabel = assigned[zoneId];
    if (occupyingLabel && occupyingLabel.id === labelId) {
      return;
    }

    const nextAssigned = Object.keys(assigned).reduce((acc, key) => {
      const current = assigned[key];
      acc[key] = current && current.id === labelId ? null : current;
      return acc;
    }, {});

    nextAssigned[zoneId] = label;

    let nextAvailable = available.filter((item) => item.id !== labelId);
    if (occupyingLabel) {
      nextAvailable = [...nextAvailable, occupyingLabel];
    }
    nextAvailable.sort((a, b) => a.text.localeCompare(b.text));

    setAssigned(nextAssigned);
    setAvailable(nextAvailable);
  };

  const handleRemove = (zoneId) => {
    const label = assigned[zoneId];
    if (!label) {
      setFeedback(null);
      return;
    }

    const nextAssigned = { ...assigned, [zoneId]: null };
    const nextAvailable = [...available, label].sort((a, b) =>
      a.text.localeCompare(b.text)
    );

    setAssigned(nextAssigned);
    setAvailable(nextAvailable);
    setFeedback(null);
  };

  const handleReset = () => {
    setAssigned(computeAssignedMap());
    setAvailable(sourceLabels);
    setFeedback(null);
  };

  const handleCheckAnswers = () => {
    const totalZones = targetZones.length;
    const correct = targetZones.filter((zone) => {
      const label = assigned[zone.id];
      return label && label.matches === zone.id;
    }).length;

    if (correct === totalZones) {
      setFeedback({
        type: "success",
        message: "Perfect! Every label is in the correct position.",
      });
      return;
    }

    const missing = totalZones - completedCount;

    if (missing > 0) {
      setFeedback({
        type: "info",
        message: `You still have ${missing} pin${missing === 1 ? "" : "s"} to label.`,
      });
      return;
    }

    setFeedback({
      type: "warning",
      message: `${correct}/${totalZones} are correct. Adjust the mismatched labels and try again.`,
    });
  };

  return (
    <div className="mx-auto mt-10 max-w-5xl space-y-8 px-4">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold text-purple-700">
          Label the World Map
        </h1>
        <p className="text-gray-600">
          Drag each country name onto the correct location on the map. Use the
          hints to guide your placement.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-purple-300 bg-white shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/BlankMap-World-v2.png/1280px-BlankMap-World-v2.png"
            alt="World map with country borders"
            className="h-full w-full object-cover"
          />
          {targetZones.map((zone) => {
            const label = assigned[zone.id];
            const isCorrect = label ? label.matches === zone.id : false;

            return (
              <div
                key={zone.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ top: zone.top, left: zone.left }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, zone.id)}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-500 bg-white text-sm font-semibold text-purple-600 shadow ${
                    label ? (isCorrect ? "bg-green-100" : "bg-yellow-100") : ""
                  }`}
                  title={label ? label.text : `Drop ${zone.label} here`}
                >
                  {label ? (isCorrect ? "✓" : "!") : "?"}
                </div>
                <div
                  className={`flex min-w-[9rem] items-center justify-between gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow ${
                    label
                      ? isCorrect
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-yellow-300 bg-yellow-50 text-yellow-700"
                      : "border-purple-200 bg-white text-purple-600"
                  }`}
                >
                  <span>{label ? label.text : `Place ${zone.label}`}</span>
                  {label && (
                    <button
                      onClick={() => handleRemove(zone.id)}
                      className="text-[11px] font-bold text-purple-600 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
            <p className="text-sm text-purple-700">
              Drag labels from this bank and drop them on the matching pin.
              Hover each label for a helpful clue.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {available.map((label) => (
              <button
                key={label.id}
                draggable
                onDragStart={(event) => handleDragStart(event, label.id)}
                className="group inline-flex cursor-grab items-center gap-2 rounded-lg border border-purple-300 bg-white px-4 py-2 text-sm font-medium text-purple-700 shadow-sm transition hover:border-purple-400 hover:bg-purple-50 active:cursor-grabbing"
                title={label.helper}
              >
                <span>{label.text}</span>
              </button>
            ))}
            {available.length === 0 && (
              <p className="text-sm text-gray-500">All labels placed.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-purple-100 pt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-purple-700">{completedCount}</span>{" "}
              of {targetZones.length} pins labeled
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleCheckAnswers}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700"
              >
                Check Answers
              </button>
            </div>
          </div>

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
        </aside>
      </section>
    </div>
  );
}
