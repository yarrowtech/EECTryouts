import { useEffect, useState } from "react";
import { BetweenHorizonalEnd } from "lucide-react";
import Quill from "quill";


export default function QuillEditor() {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const quill = new Quill("#editor", {
      theme: "snow",
      placeholder: "Type your answer here...",
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            insert: function () {
              const range = quill.getSelection();
              if (range) {
                quill.insertText(range.index, "${{______}}")
              }
            },
          },
        },
      },
    });


    quill.on("text-change", () => {
      setWordCount(quill.getText().trim().split(/\s+/).length);
      setCharCount(quill.getText().length - 1);
    });
  }, []);

  return (
    <div>
      <div id="toolbar">
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-list"
            value="ordered"
            aria-label="list: ordered"
          ></button>
          <button
            className="ql-list"
            value="bullet"
            aria-label="list: bullet"
          ></button>
          <button
            className="ql-list"
            value="check"
            aria-label="list: check"
          ></button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-script"
            value="super"
            aria-label="script: super"
          ></button>
          <button
            className="ql-script"
            value="sub"
            aria-label="script: sub"
          ></button>
        </span>
        <span className="ql-formats">
          <button
            className="ql-indent"
            value="+1"
            aria-label="indent: +1"
          ></button>
          <button
            className="ql-indent"
            value="-1"
            aria-label="indent: -1"
          ></button>
        </span>
        <select className="ql-header">
          <option value="1"></option>
          <option value="2"></option>
          <option value="3"></option>
          <option value="4"></option>
          <option value="5"></option>
          <option value="6"></option>
        </select>
        <span className="ql-formats">
          <select className="ql-align"></select>
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-insert">
            <BetweenHorizonalEnd />
          </button>
        </span>
      </div>
      <div id="editor"></div>
    </div>
  );
}
