import React, { useRef, useState } from 'react'

export default function DragDrop() {
    const [questionSet, setQuestionSet] = useState([
        {question: "There are several different types of drums. The ${{blank}} drum is a long bodied drum typically held between the knees and played with the fingers. A drum with small metal disc around the edge played by being shaken is a ${{blank}}. Many years ago, a ${{blank}} drum was used to announce an army's arrival onto a battlefield. Finally, the biggest drum in a marching band is called a ${{blank}} drum.",
        options: ["snare", "bass", "tom-tom", "cymbal"]
        },
    ])
    return (
        <section className='w-[60vw] m-auto flex flex-col items-center gap-3 pt-10 font-semibold'>
            {
                questionSet.map((question, index) => (
                    <QuestionCard key={index} question={question} />
                ))
            }
        </section>
    )
}

function QuestionCard({question}) {
    const parts = question.question.split("${{blank}}")
    const [ options, setOptions ] = useState(question.options)
    const dropBoxRef = useRef([])
    const [ showDrop, setShowDrop ] = useState(options.map(() => {return {show: false, value: ""}}));
    return (
        <div className='w-3/4 border flex flex-col items-center justify-center gap-5 border-purple-500 p-8 rounded-xl shadow-lg'>
            <div>
                {
                    parts.map((part, i) => {
                        return (
                            <React.Fragment key={i}>
                                <span className='select-none'>{part}</span>
                                {
                                    i < parts.length - 1 ?
                                    <span ref={(el) => dropBoxRef.current[i]=el} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
                                        const data = e.dataTransfer.getData("text");
                                        const temp = showDrop
                                        temp[i].show = true;
                                        temp[i].value = data;
                                        setShowDrop([...temp]);
                                        setOptions(options.filter(option => option !== data));
                                    }} className={`inline-block px-4 py-2 min-w-15 min-h-7 border-dashed border-3 border-black ${showDrop[i].show ? "border-purple-400" : ""}`}>
                                        {
                                            showDrop[i].show ?
                                            <div className='flex items-center justify-center gap-2'>
                                            <span>{showDrop[i].value}</span>
                                            <button onClick={() => {
                                                const temp = showDrop;
                                                temp[i].show = false;
                                                setShowDrop([...temp]);
                                                setOptions([...options, showDrop[i].value]);
                                            }} className='bg-gray-200 px-2 rounded-md cursor-pointer'>x</button>
                                            </div>
                                            : ""
                                        }
                                    </span> : ""
                                }
                            </React.Fragment>
                        )
                    })
                }
            </div>
            <div className='bg-yellow-100 w-full flex items-center justify-center gap-2 p-5 rounded-xl'>
                {
                    options.map((option, index) => (
                        <div draggable={true} onDragStart={(e) => e.dataTransfer.setData("text", e.currentTarget.innerText)} className='bg-gray-200 px-5 py-2 rounded-lg cursor-grab border border-purple-300 hover:border-purple-500' key={index}>{option}</div>
                    ))
                }
            </div>
        </div>
    )
}