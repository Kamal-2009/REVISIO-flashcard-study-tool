import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
  );
}

function Login({onSuccess}) {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function Auth(n, p) {
        /* perform authentication by fetching from route */
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username: n,
                password: p
            })
        })
        const data = await response.json()
        if (!data.success) {
            setError(data.error)
            setLoading(false)
            return
        } else {
            onSuccess()
            navigate("/")
            setLoading(false)
            return
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUser(values => ({...values, [name]: value}))
        setError("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        if (!user.username.trim() || !user.password.trim()) {
            setError("fill all fields!")
            setLoading(false)
            return;
        }
        Auth(user.username.trim(), user.password.trim())
    }


    return (
        <div className="flex min-h-dvh items-center justify-center">
            <div className="bg-[#ffeedd]/20 rounded-lg overflow-hidden border border-[#9381ff]/30 pb-8 w-lg">
            <h1 className="bg-[#9381ff] rounded-b-lg px-6 py-5 text-4xl text-center font-semibold leading-tight text-[#f8f7ff]">
                Welcome back!
            </h1>
            <form onSubmit={handleSubmit} className="p-6 text-[#1F2937] space-y-4">
                <div className="flex flex-col items-start w-full">
                <label className="block text-sm font-medium ">
                    Username:
                </label>
                <input 
                    type = "text"
                    name = "username"
                    value = {user.username}
                    onChange = {handleChange}
                    className="w-full mt-1 px-3 py-2 
                            bg-[#b8b8ff40] rounded-md
                            border border-[#9381ff]/20
                            focus:outline-none
                            focus:border-[#9381ff]
                            focus:ring-1 focus:ring-[#9381ff]
                            transition duration-300"       
                />
                </div> 
                
                <div className="flex flex-col items-start w-full">
                <label className="block text-sm font-medium">
                    Password:
                </label>
                <input 
                    type = "password"
                    name = "password"
                    value = {user.password}
                    onChange = {handleChange}
                    className="w-full mt-1 px-3 py-2 
                            bg-[#b8b8ff40] rounded-md
                            border border-[#9381ff]/20
                            focus:outline-none
                            focus:border-[#9381ff]
                            focus:ring-1 focus:ring-[#9381ff]
                            transition duration-300"   
                />
                </div>

                {error && (
                    <p className="text-sm text-center text-[#6f1a07]">
                        {error}
                    </p>
                )}
                <button 
                type = "submit"
                disabled={loading}
                className="flex items-center justify-center
                        w-full bg-[#9381FF] 
                        text-[#f8f7ff]
                        py-2 rounded-md
                        font-medium
                        hover:opacity-90
                        transition-colors duration-300"
                >
                {loading ? <Spinner /> : "Login"} 
                </button>
            </form>
            <p className="text-center text-sm text-[#2b2118]">
                Don't have an account?{" "} 
                <Link to="/register" className="font-medium underline! hover:opacity-80">
                Register Here!
                </Link>
            </p>
            </div>
        </div>
    )
}

export default Login