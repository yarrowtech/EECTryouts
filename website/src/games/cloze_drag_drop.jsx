import React, { useEffect, useRef, useState } from "react";

export default function ClozeDragDrop() {
  const [questionSet, setQuestionSet] = useState([]);
  const [optionPos, setOptionPos] = useState("down");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/drag-drop/fetch`)
      .then((response) => response.json())
      .then((data) => {
        setQuestionSet(data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [])

  return (
    <section className={`${optionPos == 'left' || optionPos == 'right' ? 'w-[80vw]' : 'w-[60vw]'} m-auto flex flex-col items-center gap-3 pt-10`}>
        <div className="absolute top-2 right-2 flex gap-2 items-center">
            <label className="text-purple-500">Option Position:</label>
            <select name="" id="" className="border-2 border-purple-500 p-2 rounded-xl" onChange={(e) => setOptionPos(e.target.value)}>
                <option value="" hidden>Select Option Position</option>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
            </select>
        </div>
      {questionSet.map((question, index) => (
        <QuestionCard key={index} question={question} optionPos={optionPos} />
      ))}
    </section>
  );
}

function QuestionCard({ question, optionPos }) {
  const parts = question.question.split("${{________}}");
  const [options, setOptions] = useState(question.options);
  const dropBoxRef = useRef([]);
  const [showDrop, setShowDrop] = useState(
    options.map(() => {
      return { show: false, value: "" };
    })
  );
  const upArrow = "-top-4 left-1/2 -translate-x-1/2 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-yellow-100 border-t-0"
  const downArrow = "-bottom-4 left-1/2 -translate-x-1/2 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-100 border-b-0";
  const leftArrow = "-left-4 top-1/2 -translate-y-1/2 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[30px] border-r-yellow-100 border-l-0";
  const rightArrow = "-right-4 top-1/2 -translate-y-1/2 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-l-[30px] border-l-yellow-100 border-r-0";
  return (
    <div className={`w-3/4 border flex ${optionPos == "down" ? 'flex-col' : optionPos == "left" ? 'flex-row-reverse' : optionPos == "right" ? 'flex-row' : 'flex-col-reverse'} items-center justify-center gap-5 border-purple-500 p-8 rounded-xl shadow-l`}>
      <div className="flex">
        {parts.map((part, i) => {
          return (
            <React.Fragment key={i}>
              <span className="select-none self-end" dangerouslySetInnerHTML={{ __html: part }}></span>
              {i < parts.length - 1 ? (
                <span
                  ref={(el) => (dropBoxRef.current[i] = el)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const data = e.dataTransfer.getData("text");
                    const temp = [...showDrop];
                    if (temp[i].show) return
                    temp[i].show = true;
                    temp[i].value = data;
                    setShowDrop([...temp]);
                    setOptions(options.filter((option) => option !== data));
                  }}
                  className={`inline-block px-4 py-2 min-w-15 min-h-7 border-dashed border-3 border-black ${
                    showDrop[i].show ? "border-purple-400" : ""
                  }`}
                >
                  {showDrop[i].show ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>{showDrop[i].value}</span>
                      <button
                        onClick={() => {
                          const temp = [...showDrop];
                          temp[i].show = false;
                          setShowDrop([...temp]);
                          setOptions([...options, showDrop[i].value]);
                        }}
                        className="bg-gray-200 px-2 rounded-md cursor-pointer"
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              ) : (
                ""
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="w-full relative">
        <div className={`absolute ${optionPos == 'up' ? downArrow : optionPos == 'left' ? rightArrow : optionPos == 'right' ? leftArrow : upArrow} w-5 h-5`}></div>
        <div className={`bg-yellow-100 w-full flex ${optionPos != 'up' && optionPos != 'down' ? 'flex-col' : ''} items-center justify-center gap-2 p-5 rounded-xl`}>
          {options.map((option, index) => (
            <div
              draggable={true}
              onDragStart={(e) =>
                e.dataTransfer.setData("text", e.currentTarget.innerText)
              }
              className="bg-gray-200 px-5 py-2 rounded-lg cursor-grab border border-purple-300 hover:border-purple-500"
              key={index}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
