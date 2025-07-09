import { Trash2, Plus, Ban, FastForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuillEditor from "../utils/quill";
import { toast } from "react-toastify";

export default function ClozeDragDropPanel() {
  const [optionList, setOptionList] = useState([]);
  const [showOptionInput, setShowOptionInput] = useState(false);
  const optionInputRef = useRef(null);
  const [posting, setPosting] = useState(false);
  const [blankCount, setBlankCount] = useState(0);

  function handleOptionAdd() {
    const newOption = { value: optionInputRef.current.value.trim(), answer: 0 };
    if (newOption) {
      setOptionList([...optionList, newOption]);
      optionInputRef.current.value = "";
    }
  }

  function handlePost() {
    setPosting(true);
    if (
      blankCount > optionList.length ||
      blankCount > optionList.filter((option) => option.answer !== 0).length
    ) {
      toast.error(
        "You need to provide at least as many options as there are blanks in the question."
      );
      setPosting(false);
      return;
    }
    const question = document.querySelector(".ql-editor").innerHTML.trim();
    let answer = [...optionList.filter((o) => o.answer !== 0)];
    answer.forEach((option, i) => {
      for (let j = 0; j < i; j++) {
        if (option.answer > answer[j].answer) {
          const temp = answer[i];
          answer[i] = answer[j];
          answer[j] = temp;
        }
      }
    });
    answer = answer.reverse().map((o) => o.value);
    let options = optionList.map((o) => o.value);
    fetch(`${import.meta.env.VITE_API_URL}/drag-drop/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, answer, options }),
    })
      .then(async (response) => {
        const data = await response.json();
        return [data, response];
      })
      .then(([data, response]) => {
        if (!response.ok) {
          throw new Error(data.message);
        }
        toast.success(data.message);
        document.querySelector(".ql-editor").innerHTML = "";
        setOptionList([]);
        setPosting(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setPosting(false);
      });
  }

  function handleBlankNoSelection(e, index) {
    let newOptions = optionList.map((option, i) => {
      if (e.target.value == option.answer) {
        return { ...option, answer: 0 };
      }
      return option;
    });
    newOptions[index].answer = parseInt(e.target.value);
    setOptionList(newOptions);
  }

  useEffect(() => {
    const editor = document.querySelector(".ql-editor");
    if (!editor) return;

    const updateBlankCount = () => {
      const count = Array.from(
        editor.innerHTML.matchAll(/\$\{\{________\}\}/g)
      ).length;
      setBlankCount(count);
    };

    const observer = new MutationObserver(updateBlankCount);
    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    updateBlankCount();

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-[60vw] my-10 mx-auto grid gap-5">
      <p>Compose the question:</p>
      <QuillEditor type="question-editor" />
      <p>Set answers:</p>
      <div className="flex flex-col gap-2">
        {optionList.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr_150px_50px] gap-2">
            <p className="p-3 bg-purple-400 rounded-lg">{option.value}</p>
            <select
              className="border-2 border-solid border-purple-500 p-2 rounded-lg outline-none"
              onChange={(e) => handleBlankNoSelection(e, index)}
              value={option.answer}
            >
              {Array.from({ length: blankCount }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {`Blank ${i + 1}`}
                </option>
              ))}
              <option value="0">Not an Answer</option>
            </select>
            <div
              className="self-center flex justify-center items-center cursor-pointer h-full w-full"
              onClick={() => {
                const newOptions = optionList.filter((_, i) => i !== index);
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
                if (e.key === "Enter") handleOptionAdd();
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
      <button
        onClick={handlePost}
        className="bg-purple-400 px-3 py-1 rounded-xl cursor-pointer text-white"
        disabled={posting}
      >
        {posting ? "Posting...." : "Post"}
      </button>
    </section>
  );
}
