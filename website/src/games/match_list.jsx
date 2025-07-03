import React, { useState } from "react";

export default function MatchList() {
  const [questionSet, setQuestionSet] = React.useState([
    {
      items: ["Car", "Plane", "Lake"],
      pairs: ["Drive", "Fly", "Swim"],
    },
  ]);
  return (
    <section className="w-[60vw] flex flex-col m-auto mt-10">
      {questionSet.map((question, index) => (
        <QuestionCard
          key={index}
          items={question.items}
          pairs={question.pairs}
        />
      ))}
    </section>
  );
}

function QuestionCard({ items, pairs }) {
  const [allPairs, setAllPairs] = useState(pairs);
  const [showMatch, setShowMatch] = useState(
    items.map(() => {
      return { show: false, value: "" };
    })
  );
  return (
    <div className="w-full flex flex-col items-center gap-5">
        <h2 className="font-bold text-2xl">Match Items</h2>
      <div className={`w-3/4 grid grid-cols-3 grid-rows-${items.length} gap-y-3`}>
        {items.map((item, i) => {
          return (
            <div key={i} className="contents">
            <p
              className="min-h-10 p-2 min-w-10 rounded-lg border box-border border-purple-500"
              >
              {item}
            </p>
            <hr key={`line-${i}`} className="self-center" />
            <p
              className={`min-h-10 p-2 min-w-10 rounded-lg border border-gray-300 box-border ${showMatch[i].show ? "bg-yellow-100 flex justify-between border-purple-500" : ""}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const data = e.dataTransfer.getData("text");
                const temp = [...showMatch];
                temp[i].show = true;
                temp[i].value = data;
                setShowMatch([...temp]);
                setAllPairs(allPairs.filter((pair) => pair !== data));
              }}
              >
                {showMatch[i].show ? (
                    <>
                    <span>{showMatch[i].value}</span>
                    <button
                        onClick={() => {
                          const temp = [...showMatch];
                          temp[i].show = false;
                          setAllPairs([...allPairs, temp[i].value]);
                          setShowMatch([...temp]);
                        }}
                        className="bg-gray-200 px-2 rounded-md cursor-pointer"
                      >
                        x
                      </button>
                    </>
                ) : ""}
            </p>
            </div>
          );
        })}
      </div>
      <div className="w-full relative">
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-yellow-100 border-t-0 w-5 h-5`}
        ></div>
        <div
          className={`bg-yellow-100 w-full flex items-center justify-center gap-2 p-5 rounded-xl`}
        >
          {allPairs.map((pair, index) => (
            <div
              draggable={true}
              onDragStart={(e) =>
                e.dataTransfer.setData("text", e.currentTarget.innerText)
              }
              className="bg-gray-200 px-5 py-2 rounded-lg cursor-grab border border-purple-300 hover:border-purple-500"
              key={index}
            >
              {pair}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
