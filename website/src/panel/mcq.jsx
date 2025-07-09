import { Trash2, Plus, Ban, BookOpenCheck, BookOpen } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function MCQPanel() {
  const [optionList, setOptionList] = useState([]);
  const [showOptionInput, setShowOptionInput] = useState(false);
  const questionInputRef = useRef(null);
  const optionInputRef = useRef(null);
  const [posting, setPosting] = useState(false);

  function handleOptionAdd() {
    if (optionList.length >= 4) {
      toast.error("You can only add up to 4 options.");
      return;
    }
    const newOption = optionInputRef.current.value.trim();
    if (newOption) {
      setOptionList([
        ...optionList,
        { value: newOption, answer: optionList.length === 0 },
      ]);
      optionInputRef.current.value = "";
    }
  }

  function handlePost() {
    const question = questionInputRef.current.value.trim();
    const options = optionList
      .map((option) => option.value.trim())
      .filter((option) => option);
    if (question && options.length > 0) {
      const data = {
        question,
        options,
        answer: optionList.find((option) => option.answer)?.value,
      };
      setPosting(true)
      fetch(`${import.meta.env.VITE_API_URL}/mcq/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (response) => {
            const data = await response.json();
            return [data, response];
        })
        .then(([data, response]) => {
            if (!response.ok) {
              throw new Error(data.message)
            }
            toast.success(data.message);
          questionInputRef.current.value = "";
          setOptionList([]);
          setPosting(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setPosting(false);
        });
    } else {
      toast.error("Please fill in the question and at least one option.");
    }
  }

  return (
    <section className="w-[60vw] my-10 mx-auto grid gap-5">
      <label htmlFor="question">Compose a question:</label>
      <input
        id="question"
        type="text"
        className="outline-none p-2 border-solid border-purple-500 border-2 rounded-xl"
        ref={questionInputRef}
      />
      <p>Set options:</p>
      <div className="flex flex-col gap-2">
        {optionList.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr_50px_50px] gap-2">
            <p className="p-3 bg-purple-400 rounded-lg">{option.value}</p>
            <div
              className="self-center flex justify-center items-center cursor-pointer h-full w-full"
              onClick={() => {
                const newOptions = optionList.map((_, i) => {
                  if (i === index) {
                    return { ...option, answer: true };
                  }
                  return { ..._, answer: false };
                });
                setOptionList(newOptions);
              }}
            >
              {!option.answer ? <BookOpen /> : <BookOpenCheck color="green" />}
            </div>
            <div
              className="self-center flex justify-center items-center cursor-pointer h-full w-full"
              onClick={() => {
                let newOptions = optionList.filter((_, i) => i !== index);
                const answerExists = newOptions.reduce(
                  (acc, curr) => acc || curr.answer,
                  false
                );
                if (!answerExists && newOptions.length > 0)
                  newOptions[0].answer = true;
                setOptionList(newOptions);
              }}
            >
              <Trash2 />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center min-w-1/10 max-w-2/10 bg-purple-400 p-3 rounded-xl cursor-pointer text-white font-bold"
          onClick={() => setShowOptionInput(!showOptionInput)}
        >
          {showOptionInput ? (
            <>
              <Ban /> Cancel
            </>
          ) : (
            <>
              <Plus />
              Add
            </>
          )}
        </button>
        {showOptionInput && (
          <div className="grid grid-cols-[1fr_50px] gap-3">
            <input
              type="text"
              className="outline-none border-2 border-solid border-purple-500 p-2 rounded-lg"
              placeholder="Enter option...."
              ref={optionInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOptionAdd();
                }
              }}
            />
            <button
              className="bg-purple-400 px-3 py-1 rounded-xl cursor-pointer text-white"
              onClick={handleOptionAdd}
            >
              Add
            </button>
          </div>
        )}
      </div>
      <button className="bg-purple-400 p-3 rounded-xl cursor-pointer text-white font-bold" disabled={posting} onClick={handlePost}>
        {posting ? "Posting..." : "Post"}
      </button>
    </section>
  );
}
