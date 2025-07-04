import { useEffect, useState } from "react";

export default function RichText() {
  const [questionSet, setQuestionSet] = useState([
    "Describe the difference between physical activity and exercise.",
  ]);

  return (
    <section className="w-[60vw] flex flex-col m-auto mt-10">
      {questionSet.map((question, index) => (
        <QuestionCard key={index} question={question} />
      ))}
    </section>
  );
}

function QuestionCard({ question }) {

    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ];
    const quill = new Quill("#editor", {
      theme: "snow",
      placeholder: "Type your answer here...",
      modules: {
        toolbar: toolbarOptions,
      },
    });
    quill.on("text-change", () => {
        setWordCount(quill.getText().trim().split(/\s+/).length);
        setCharCount(quill.getText().length-1);
    })
    const toolbar = quill.getModule("toolbar");
    toolbar.addHandler("word count", () => {
        console.log("word count is clicked");
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <p>{question}</p>
      <div className="flex flex-col">
        <div id="editor"></div>
        <div className="text-xs self-end flex gap-3">
            <p className="">{charCount} chars</p>
            <p className="">{wordCount} words</p>
        </div>
      </div>
    </div>
  );
}
