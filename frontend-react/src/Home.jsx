import { useEffect, useState } from "react"
import Study from "./Study"
import AddDeck from "./AddDeck"
import { Route, Routes, useNavigate } from "react-router-dom"
import logo from "./assets/logo.svg"
import plus from "./assets/plus.svg"
import edit from "./assets/edit.svg"
import play from "./assets/play.svg"

function Home({onLogout}) {
    const [error, setError] = useState("")
    const [decks, setDecks] = useState([])
    const navigate = useNavigate()

    async function loadDecks() {
        let response = await fetch("http://localhost:5000/load_decks", {
            credentials: "include"
        })
        let data = await response.json()
        if (!data.success) {
            setError(data.error)
            alert(data.error)
            return
        } else {
            setDecks(data.decks)
            return
        }
    }

    async function handleLogout() {
        const response = await fetch("http://localhost:5000/logout", {
            credentials: "include"
        })
        const data = await response.json()
        alert(data.message)
        onLogout()
        return
    }

    async function handleDelete(did) {
        const ok = confirm("Are you sure you want to delete this deck?")
        if (!ok) {
            return
        }

        const response = await fetch("http://localhost:5000/delete_deck", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "deck_id": did
            })
        })
        const data = await response.json()
        if (!data.success) {
            alert(data.error)
            return
        }
        loadDecks()
        return
    }

    const handleEdit = () => {
        alert("Coming Soon!!")
        return 
    }

    useEffect(() => {
        loadDecks();
    }, [])

    return (
        <>
        
        <Routes>
            <Route path='/' element={
                <div className="min-h-dvh">
                    <div className="bg-[#B8B8FF] text-[#F8F7FF] border-b border-[#9381FF]">
                    <div className="max-w-7xl mx-auto px-6 py-5">    
                        <div className="flex items-center justify-between md:px-16">
                        <div className="flex items-center">
                            <div className="bg-[#9381FF] w-10 h-10 rounded-[10px] flex items-center justify-center">
                                <img src={logo} alt="Logo" className="h-8 w-auto invert"/>
                            </div>
                            <h1 className="ml-4 font-semibold text-4xl relative -top-px">Revisio</h1>
                        </div>
                        <div className="flex text-lg">
                            <button onClick={handleLogout} className="text-[#9381ff] transition duration-300 hover:underline hover:text-inherit mx-4">Logout</button>
                            <button onClick={() => navigate('/add_deck')} className="bg-[#9381FF] rounded-[10px] p-2 flex hover:opacity-80 transition duration-300">
                                <img src={plus} alt="add" className="h-7 w-auto invert mr-2"/> 
                                <span className="relative -top-[0.75px]">Create Deck</span>
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="text-[#1F2937] max-w-7xl mx-auto px-6 py-5 md:px-22">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-[550]">My Decks</h2>
                            <p className="opacity-85">{ decks.length } decks available</p>
                        </div>
                        {error && <p>{error}</p>}

                        {decks.length === 0 ? (
                            <div className="text-center opacity-80 py-16">
                                <p className="mb-4">You don't have any decks yet.</p>
                                <button className="bg-[#9381FF] text-[#F8F7FF] px-4 py-2 rounded-lg">
                                Create your first deck
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {decks.map(deck => (
                                <div key={deck.deck_id} className="rounded-[10px] border border-gray-300 p-4 hover:shadow-sm transition-shadow duration-300">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                        <img src={logo} alt="Logo" className="h-8 w-auto pr-2"/>
                                        <h4 className="text-2xl line-clamp-1">{deck.name}</h4>
                                        </div>
                                        <p className="opacity-70 text-sm font-[350]">{deck.num} cards</p>
                                    </div>
                                    <p className="opacity-80 py-2 line-clamp-3">{deck.description} </p>
                                    <div className="flex gap-2 pt-4">
                                    <button 
                                        onClick={() => navigate(`/study/deck/${deck.deck_id}`)}
                                        className="flex grow justify-center items-center bg-[#9381FF] text-[#F8F7FF] rounded-lg px-2 py-1 hover:opacity-80 transition duration-300">
                                        <img src={play} alt="play" className="h-7 w-auto invert py-1 pr-1"/>
                                        <span className="relative -top-[0.85px]">Study</span>
                                    </button>
                                    <button 
                                        onClick={handleEdit}
                                        className="rounded-lg px-2.5 py-1.5 border border-gray-300 transition duration-300 hover:bg-gray-200">
                                        <img src={edit} alt="Edit" className="h-5 w-auto"/>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(deck.deck_id)}
                                        className="rounded-lg px-2.5 py-1.5 border border-gray-300 bg-[#ffeedd] hover:bg-[#ffd8be] transition duration-300">
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-[#6f1a07]"
                                            >
                                            <path
                                                d="M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            </svg>
                                    </button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        )}

                        
                    </div>
                </div>} 
            />
            <Route path='/study/deck/:deck_id' element={<Study />} />
            <Route path='/add_deck' element={<AddDeck />} />
        </Routes>
        </>
        
    )
}

export default Home