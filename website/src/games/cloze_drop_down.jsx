import React, { useState } from "react";


export default function ClozeDropDown() {
    const [questionSet, setQuestionSet] = useState([
        {
            question: "Yesterday, we ${{input}} to the store. Tomorrow we ${{input}} to school.",
            options: [["go", "went", "gone"], ["go", "will go", "going"]]
        },
    ])
    return (
        <section className={`m-auto flex flex-col items-center gap-3 pt-10`}>
            {questionSet.map((question, index) => (
                <QuestionCard key={index} question={question.question} options={question.options} />
            ))}
        </section>
    )
}


function QuestionCard({ question, options }) {
    const parts = question.split("${{input}}");
    return (
        <div className="w-3/4 border flex flex-col items-center justify-center gap-5 border-purple-500 p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-500 self-start">Fill in the blanks from the drop down:</h2>
            <div>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span className="select-none">{part}</span>
                        {i < parts.length - 1 && (
                            <select className="border-2 p-2 border-purple-500 focus:outline-none w-24">
                                <option value="" hidden></option>
                                {
                                    options[i].map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))
                                }
                            </select>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}