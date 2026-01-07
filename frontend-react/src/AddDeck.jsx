import { useEffect, useState } from "react"

function AddDeck() {
    const [deck, setDeck] = useState({
        name: "",
        description: ""
    })
    const [cards, setCards] = useState([
        {id: crypto.randomUUID(), ques: "", ans: ""},
        {id: crypto.randomUUID(), ques: "", ans: ""},
        {id: crypto.randomUUID(), ques: "", ans: ""}
    ])

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

    return (
        <div className="min-h-dvh flex items-center justify-center">
            <div className="border border-[#9381ff]/30 rounded-xl bg-[#ffeedd]/20 text-[#1f2937] p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col items-start w-full">
                <label className="block text-sm font-medium">
                    Enter Deck name:
                </label>
                <input 
                    type="text" name="name" 
                    value={deck.name} onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 rounded-md
                            border border-[#9381ff]/30
                            focus:outline-none
                            focus:border-[#9381ff]
                            focus:ring-1 focus:ring-[#9381ff]/50
                            transition duration-300"
                />
                </div>

                <div className="flex flex-col items-start w-full">
                <label className="block text-sm font-medium">
                    Enter Deck desription:
                </label>        
                <input 
                    type="text" name="description" 
                    value={deck.description} onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 rounded-md
                            border border-[#9381ff]/30
                            focus:outline-none
                            focus:border-[#9381ff]
                            focus:ring-1 focus:ring-[#9381ff]/50
                            transition duration-300" 
                />
                </div>

                <div>
                {cards.map((card, index) => (<>
                    <label key={card.id}>
                        Card {index + 1}:
                    </label> 
                    <input 
                        type="text" name="ques" 
                        value={card.ques} placeholder={`Question ${index + 1}`} 
                        onChange={(e) => handleCardChange(index, e.target.name, e.target.value)} 
                    /> 
                    <input 
                        type="text" name="ans" 
                        value={card.ans} placeholder={`Answer ${index + 1}`} 
                        onChange={(e) => handleCardChange(index, e.target.name, e.target.value)} 
                    />  
                    </>
                ))}
                </div>
                <button type="button" onClick={addCard}>Add another Card</button>
                <button type="submit">Submit</button>
            </form>
            </div>
        </div>
    )
}

export default AddDeck