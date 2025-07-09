import { Trash2, Plus, Ban, FastForward } from "lucide-react";
import { useRef, useState } from "react";
import QuillEditor from "../utils/quill";
import { toast } from "react-toastify";

export default function ClozeDragDropPanel() {
  const [optionList, setOptionList] = useState([]);
  const [showOptionInput, setShowOptionInput] = useState(false);
  const optionInputRef = useRef(null);
  const [posting, setPosting] = useState(false);

  function handleOptionAdd() {
    const newOption = optionInputRef.current.value.trim();
    if (newOption) {
      setOptionList([...optionList, newOption]);
      optionInputRef.current.value = "";
    }
  }

  function handlePost() {
    setPosting(true);
    const question = document.querySelector(".ql-editor").innerHTML.trim();
    const blankCount = Array.from(
      question.matchAll(/\$\{\{________\}\}/g)
    ).length;
    if (blankCount > optionList.length) {
      toast.error(
        "You need to provide at least as many options as there are blanks in the question."
      );
      setPosting(false);
      return;
    }
    setTimeout(() => {
      toast.success("Question posted successfully!");
      setPosting(false);
    }, 2000);
  }

  return (
    <section className="w-[60vw] my-10 mx-auto grid gap-5">
      <p>Compose the question:</p>
      <QuillEditor />
      <p className="mt-20">Set answers:</p>
      <div className="flex flex-col gap-2">
        {optionList.map((option, index) => (
          <div key={index} className="grid grid-cols-[1fr_50px] gap-2">
            <p className="p-3 bg-purple-400 rounded-lg">{option}</p>
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
