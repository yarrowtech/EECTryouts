import { useEffect, useState } from "react";
import Quill from "quill";
import QuillEditor from "../utils/quill";

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

  return (
    <div className="flex flex-col gap-5">
      <p>{question}</p>
      <QuillEditor type="answer-editor" />
    </div>
  );
}
