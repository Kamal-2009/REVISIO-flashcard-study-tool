import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AddDeck( { initialCards } ) {
    const [deck, setDeck] = useState({
        name: "",
        description: ""
    })
    const [cards, setCards] = useState([])
    useEffect(() => {
        if (initialCards === null) {
            setCards([
                {id: crypto.randomUUID(), ques: "", ans: ""},
                {id: crypto.randomUUID(), ques: "", ans: ""},
                {id: crypto.randomUUID(), ques: "", ans: ""}
            ])
        } else {
            setCards(initialCards)
        }
    }, [initialCards])
    
    const navigate = useNavigate()

    async function submitData() {
        const response = await fetch("http://localhost:5000/add_deck", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: deck.name,
                description: deck.description,
                cards: cards
            })
        })

        const data = await response.json()

        if (!data.success) {
            alert(data.error)
            return
        }
        else {
            navigate('/')
            alert(data.message)
            return
        }
    }

    function handleCardChange(i, name, value) {
        setCards(cards.map((card, index) => 
            index === i ? {...card, [name]: value} : card
        ))
        return
    }
    
    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setDeck(values => ({...values, [name]: value}))
        return
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (Object.values(deck).some(value => !value.trim())) {
            alert("Fill all fields")
            return
        }

        if (deck.description.length > 255) {
            alert("description needs to be less than 255 characters")
            return 
        }

        for (let i = 0; i < cards.length; i++) {
            if (Object.values(cards[i]).some(value => !value.trim())) {
                alert("Fill all fields")
                return
            }
        }
        submitData()
        return
    }

    const addCard = () => {
        setCards(prevCards => [...prevCards, {id: crypto.randomUUID(), ques: "", ans: ""}])
        return
    }

    const clearFields = () => {
        setDeck({
            name: "",
            description: ""
        })
        setCards([
            {id: crypto.randomUUID(), ques: "", ans: ""},
            {id: crypto.randomUUID(), ques: "", ans: ""},
            {id: crypto.randomUUID(), ques: "", ans: ""}
        ])
        return
    }

    return (
        <div className="min-h-dvh flex items-center justify-center">
            <div className="bg-[#ffeedd]/20 rounded-lg overflow-hidden border border-[#9381ff]/30 pb-8 w-lg md:w-4xl">
            <h1 className="bg-[#9381ff] rounded-b-lg px-6 py-5 text-4xl text-center font-semibold leading-tight text-[#f8f7ff]">
                Create New Deck
            </h1>
            
            <form onSubmit={handleSubmit} className="text-[#1f2937] space-y-4">
                <div className="px-6 pt-2 ">    
                    <div className="pt-4">
                    <h4 className="text-lg">Deck details</h4>
                    <p className="opacity-70">Give your flashcard deck a name and description</p>
                    </div>
                    <div className="flex flex-col items-start w-full pt-1">
                    <label className="block text-sm font-medium">
                        Deck Name:
                    </label>
                    <input 
                        type="text" name="name" 
                        value={deck.name} onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 rounded-md
                                bg-[#b8b8ff40]
                                border border-[#9381ff]/20
                                focus:outline-none
                                focus:border-[#9381ff]
                                focus:ring-1 focus:ring-[#9381ff]
                                transition duration-300"
                        placeholder="e.g., Spanish Vocabulary, Biology Terms"
                    />
                    <p className="text-xs font-light py-1 opacity-80">Choose a clear, descriptive name for your deck</p>
                    </div>

                    <div className="flex flex-col items-start w-full">
                    <label className="block text-sm font-medium">
                        Desrciption (Optional):
                    </label>        
                    <textarea 
                        name="description" 
                        value={deck.description} onChange={handleChange}
                        className="w-full h-24 mt-1 px-3 py-2 rounded-md
                                bg-[#b8b8ff40] 
                                border border-[#9381ff]/20
                                focus:outline-none resize-none
                                focus:border-[#9381ff]
                                focus:ring-1 focus:ring-[#9381ff]
                                transition duration-300"
                        placeholder="What will you be studying with this deck?" 
                    />
                    <p className="text-xs font-light py-1 opacity-80">Add notes about what this deck covers</p>
                    </div>
                </div>

                <hr className="text-[#9381ff]/30"/>

                <div className="px-6 pt-2">
                    <div>
                    <h4 className="text-lg">Flashcards</h4>
                    <p className="opacity-70">Add questions and answers to your deck</p>
                    </div>
                    
                {cards.map((card, index) => (
                    <div key={card.id} className="flex flex-col items-start w-full pt-4 space-y-2">
                    <label className="block text-sm font-medium">
                        Card {index + 1}:
                    </label> 
                    <textarea
                        name="ques" 
                        value={card.ques} placeholder="Enter your question here..." 
                        onChange={(e) => handleCardChange(index, e.target.name, e.target.value)}
                        className="w-full h-24 mt-1 px-3 py-2 rounded-md
                                bg-[#b8b8ff40] 
                                border border-[#9381ff]/20
                                focus:outline-none resize-none
                                focus:border-[#9381ff]
                                focus:ring-1 focus:ring-[#9381ff]
                                transition duration-300" 
                    /> 
                    <textarea
                        name="ans" 
                        value={card.ans} placeholder="Enter your answer here" 
                        onChange={(e) => handleCardChange(index, e.target.name, e.target.value)}
                        className="w-full h-24 mt-1 px-3 py-2 rounded-md
                                bg-[#b8b8ff40] 
                                border border-[#9381ff]/20
                                focus:outline-none resize-none
                                focus:border-[#9381ff]
                                focus:ring-1 focus:ring-[#9381ff]
                                transition duration-300" 
                    />  
                    </div>
                ))}
                
                <button type="button" onClick={addCard} className="bg-[#9381ff] text-[#f8f7ff] w-full rounded-md py-2 mt-2 hover:opacity-80 transition duration-300">
                    Add another Card
                </button>
                </div>

                <hr className="text-[#9381ff]/30"/>
                
                <div className="grid grid-cols-2 py-2 px-6 gap-4">
                <button type="reset" onClick={clearFields} className="border rounded-md py-2 text-[#9381ff] border-[#9381ff] hover:bg-gray-200 transition duration-300">
                    Clear
                </button>
                <button type="submit" className="bg-[#9381ff] text-[#f8f7ff]  py-2 rounded-md hover:opacity-80 transition duration-300">
                    Create deck
                </button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default AddDeck