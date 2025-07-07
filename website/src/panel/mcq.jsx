import { Trash2, Plus, Ban } from "lucide-react"
import { useRef, useState } from "react"

export default function MCQPanel() {

    const [optionList, setOptionList] = useState([])
    const [showOptionInput, setShowOptionInput] = useState(false)
    const optionInputRef = useRef(null)

    return (
        <section className="w-[60vw] my-10 mx-auto grid gap-5">
            <label htmlFor="question">Compose a question:</label>
            <input id="question" type="text" className="outline-none p-2 border-solid border-purple-500 border-2 rounded-xl" />
            <p>Set options:</p>
            <div className="flex flex-col gap-2">
                {optionList.map((option, index) => (
                    <div key={index} className="grid grid-cols-[1fr_50px] gap-2">
                        <p className="p-3 bg-purple-400 rounded-lg">{option}</p>
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
        </section>
    )
}