import { useState, useRef } from "react"


export default function SortList() {
    const [questionSet, setQuestionSet] = useState([
        {
            question: "Sort the countries in ascending order based on their population:",
            list: ["USA", "India", "China", "Brazil", "Russia"],
        }
    ])
    return (
        <section className="w-[60vw] flex flex-col items-center m-auto mt-10">
            <h2 className="font-bold text-2xl">Sort List</h2>
            {
                questionSet.map((question, index) => (
                    <QuestionCard key={index} questionIndex={index} setQuestionSet={setQuestionSet} questionSet={questionSet} />
                ))
            }
        </section>
    )
}

function QuestionCard({ questionIndex, questionSet, setQuestionSet }) {
    const draggedItem = useRef(null)
    const draggedOverItem = useRef(null)
    const { question, list } = questionSet[questionIndex]
    const [itemList, setItemList] = useState(list.map(() => false));
    function handleSort(e, index) {
        const temp = list[draggedItem.current]
        list[draggedItem.current] = list[draggedOverItem.current]
        list[draggedOverItem.current] = temp
        const tempQuestionSet = [...questionSet];
        tempQuestionSet[questionIndex] = { question, list };
        setQuestionSet([...tempQuestionSet]);
        setItemList((prev) => {
            const newList = [...prev];
            newList[index] = false;
            return newList;
        });
    }
    return (
        <div className="w-3/4 flex flex-col gap-5 items-center border border-purple-500 rounded-lg shadow-lg p-5">
            <h2>{question}</h2>
            <div className="w-1/2 flex flex-col items-center justify-center">
            {
                list.map((item, index) => (
                    <p key={index} className={`w-full p-3 text-center border border-gray-300 rounded-md cursor-pointer ${itemList[index] ? "bg-yellow-100" : "bg-purple-500"} text-white`}
                     draggable
                     onDragStart={(e) => draggedItem.current = index}
                     onDragEnter={(e) => {
                        draggedOverItem.current = index
                        setItemList((prev) => {
                            const newList = [...prev];
                            newList[index] = true;
                            return newList;
                        });
                    }}
                     onDragLeave={(e) => {
                        setItemList((prev) => {
                            const newList = [...prev];
                            newList[index] = false;
                            return newList;
                        });
                     }}
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={(e) => handleSort(e, index)}
                     >
                        {item}
                    </p>
                ))
            }
            </div>
        </div>
    )
}