import { Trash2, Plus, Ban } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QuillEditor from "../utils/quill";



export default function ClozeDragDropPanel() {

    const [optionList, setOptionList] = useState([])
    const [showOptionInput, setShowOptionInput] = useState(false)
    const optionInputRef = useRef(null)
    const [blank, setBlank] = useState([])

    function handlePost() {
        console.log(blank)
    }

    useEffect(() => {
        document.querySelector(".ql-editor").addEventListener("keydown", (e) => {
            const value = document.querySelector(".ql-editor").innerHTML;
            let temp = []
            Array.from(value.matchAll(/\${{blank}}/g)).forEach((match, i) => {
                temp.push(`Answer: ${i + 1}`)
            })
            setBlank(temp);
        })
    }, [])

    return (
        <section className="w-[60vw] my-10 mx-auto grid gap-5">
            <p>Compose the question:</p>
            <QuillEditor />
            <p className="mt-20">Set answers:</p>
            <div className="flex flex-col gap-2">
                {blank.map((option, index) => (
                    <div key={index} className="grid grid-cols-[1fr_50px] gap-2">
                        <input onChange={(e) => {
                            let temp = [...blank]
                            temp[index] = e.target.value;
                            setBlank([...temp]);
                        }} contentEditable className="p-3 bg-purple-400 rounded-lg" value={option}></input>
                        <div className="self-center flex justify-center items-center cursor-pointer h-full w-full" onClick={() => {
                            const newOptions = optionList.filter((_, i) => i !== index);
                            setOptionList(newOptions);
                        }}><Trash2 /></div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center min-w-1/10 max-w-2/10 bg-purple-400 p-3 rounded-xl cursor-pointer text-white font-bold" onClick={() => setShowOptionInput(!showOptionInput)}>{showOptionInput ? <><Ban /> Cancel</> : <><Plus />Add</>}
                </button>
                {showOptionInput && <div className="grid grid-cols-[1fr_50px] gap-3">
                    <input type="text" className="outline-none border-2 border-solid border-purple-500 p-2 rounded-lg" placeholder="Enter option...." ref={optionInputRef} />
                    <button className="bg-purple-400 px-3 py-1 rounded-xl cursor-pointer text-white" onClick={() => {
                        const newOption = optionInputRef.current.value.trim();
                        if (newOption) {
                            setOptionList([...optionList, newOption]);
                            optionInputRef.current.value = '';
                        }
                    }}>Add</button>
                </div>}
            </div>
            <button onClick={handlePost} className="bg-purple-400 px-3 py-1 rounded-xl cursor-pointer text-white">Post</button>
        </section>
    )
}