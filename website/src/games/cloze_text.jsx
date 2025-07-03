import React, { useState } from "react";


export default function ClozeText() {
    const [questionSet, setQuestionSet] = useState([
        "We the ${{input}} of the United States, in order to form a more ${{input}}, establish justice, insure domestic tranquility, provide for the common defense, promote the ${{input}}, and secure the blessings of liberty to ourselves and our posterity, do ordain and establish ${{input}} for the United States of America.",
    ])
    return (
        <section className={`m-auto flex flex-col items-center gap-3 pt-10`}>
            {questionSet.map((question, index) => (
                <QuestionCard key={index} question={question} />
            ))}
        </section>
    )
}


function QuestionCard({ question }) {
    const parts = question.split("${{input}}");
    return (
        <div className="w-3/4 border flex flex-col items-center justify-center gap-5 border-purple-500 p-8 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-purple-500 self-start">Fill in the blanks to complete the passage:</h2>
            <div>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span className="select-none">{part}</span>
                        {i < parts.length - 1 && (
                            <input type="text" className="border-2 pl-2 border-purple-500 focus:outline-none w-24" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}