import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import back from "./assets/back.svg"
import restart from "./assets/restart.svg"

function Study() {
    const [error, setError] =useState("")
    const { deck_id } = useParams()
    const [deck, setDeck] = useState({})
    const [cards, setCards] = useState([])
    const [curIndex, setIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const navigate = useNavigate()
    let total = cards.length

    async function load_cards() {
        const response = await fetch(`http://localhost:5000/load_cards/${deck_id}`, {
            credentials: "include"
        })
        const data = await response.json()
        if (!data.success) {
            setError(data.error)
            alert(error)
            return
        }
        else {
            setCards(data.cards)
            setDeck(data.deck)
            return
        }
    }

    useEffect(() => {
        load_cards(); 
    }, [deck_id])

    if (cards.length === 0) {
        return <p className="p-4">Loading cards...</p>;
    }

    return (
        <div className="min-h-dvh items-center flex flex-col">
            <div className="w-full border-b-gray-300 border-b">
            <div className="grid grid-cols-3 max-w-6xl my-6 mx-auto px-4">
                <div className="justify-start flex">
                    <button 
                        type="button" 
                        onClick={() => navigate('/')}
                        className="py-2 pr-6 flex rounded-lg
                                justify-center items-center 
                                hover:bg-[#b8b8ff40] 
                                transform duration-300 ">
                        <img src={back} alt="Go Back" className="h-6 w-auto px-4"/>
                        <span className="relative -top-[0.85px]">Back to Decks</span>
                    </button>
                </div>
                
                <h2 className="text-center text-2xl font-semibold">{deck.name}</h2>

                <div className="justify-end flex">
                    <button 
                        type="button" 
                        onClick={() => setIndex(0)}
                        className="py-2 pr-6 flex rounded-lg
                                justify-center items-center 
                                hover:bg-[#b8b8ff40] 
                                transform duration-300">
                        <img src={restart} alt="restart" className="h-6 w-auto px-4"/>
                        <span className="relative -top-[0.85px]">Restart</span>
                    </button>
                </div>
                
            </div>
            </div>
        
            <div className="flex flex-col max-w-6xl  items-center justify-center w-full">
                
                <div className="flex flex-col w-full p-4">
                    <div className="flex justify-between mb-2">
                        <p>Card {curIndex + 1} of {total}</p>
                        <p>{Math.round((curIndex+1)*100/total)}% Complete</p>
                    </div>
                    <div className="h-2 rounded-full bg-gray-300 overflow-hidden">
                        <div className="h-full bg-[#9381FF] rounded-full" style={{ width:`${(curIndex+1)*100/total}%` }}></div>
                    </div>
                </div>
                
                <div className="flex flex-col mx-auto max-w-2xl w-full pt-12">
                    <div className="max-w-2xl aspect-3/2 perspective-distant">
                    <div
                        onClick={() => setFlipped(!flipped)} 
                        className={`relative w-full h-full
                            cursor-pointer transition-transform
                            duration-700 transform-3d 
                            ease-[cubic-bezier(0.34,1.56,0.64,1)]
                            ${flipped ? "rotate-y-180": ""}`}>
                        <div
                            className="border rounded-xl 
                            flex flex-col text-center 
                            justify-center bg-[#ededff] 
                            border-[#9381ff]/30
                            absolute inset-0 items-center
                            backface-hidden">
                            <p>QUESTION</p>
                            <h2>{  cards[curIndex].ques  }</h2>
                            <p>Click to reveal answer</p>
                        </div>
                        <div
                            className="border rounded-xl 
                            flex flex-col text-center 
                            justify-center bg-[#ededff] 
                            border-[#9381ff]/30
                            absolute inset-0 items-center
                            backface-hidden rotate-y-180">
                            <p>ANSWER</p>
                            <h2>{  cards[curIndex].ans  }</h2>
                            <p>Click to see question</p>
                        </div>
                    </div>
                    </div>

                    <div className="pt-8 text-center">
                        <button 
                            type="button"
                            onClick={() => setFlipped(!flipped)} 
                            className="bg-[#9381ff] py-2 w-xs
                                mx-auto text-[#f8f7ff] 
                                rounded-lg hover:opacity-70 
                                transition duration-300">
                            Flip
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-6">
                        <button 
                            type="button"
                            onClick={() => setIndex(i => Math.max(0, i - 1))}
                            disabled={curIndex === 0}
                            className={
                                curIndex === 0 ? 
                                'bg-[#b8b8ff40] border border-[#9381ff]/30 rounded-lg py-2 opacity-50':
                                'bg-[#b8b8ff40] border border-[#9381ff]/30 rounded-lg py-2 hover:bg-[#b8b8ff] transition duration-300'
                            }
                            >
                            Previous
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                if (curIndex === total - 1) {
                                    navigate('/');
                                } 
                                else { 
                                    setIndex(i => Math.min(total - 1, i + 1));
                                }}}
                            className="bg-[#b8b8ff40] 
                                    border border-[#9381ff]/30 
                                    rounded-lg py-2 
                                    hover:bg-[#b8b8ff] 
                                    transition duration-300">
                            {curIndex === total - 1 ? "Home": "Next"}
                        </button>
                    </div>
                </div>
            </div>    
        </div>
    )
}

export default Study