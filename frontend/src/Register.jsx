import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Spinner() {
  return (
    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
  );
}

function Register() {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        cnfmpass: ""
    });
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const API_URL = import.meta.env.VITE_API_URL

    async function reg({username, email, password, cnfmpass}) {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password,
                cnfmpass
            })
        })
        const data = await response.json()
        if (!data.success) {
            setError(data.error)
            setLoading(false)
            return
        } else {
            navigate('/login')
            setLoading(false)
            return
        }
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setInputs(values => ({...values, [name]: value}))
        setError("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        if (Object.values(inputs).some(value => !value.trim())) {
            setError("Fill all fields");    
            setLoading(false)      
            return
        }
        reg(inputs)
    }

    return (
        <div className="flex min-h-dvh items-center justify-center">
            <div className="bg-[#ffeedd]/20 rounded-lg overflow-hidden border border-[#9381ff]/30 pb-8 w-lg">
            <h1 className="bg-[#9381ff] rounded-b-lg px-6 py-5 text-4xl text-center font-semibold leading-tight text-[#f8f7ff]">
                Register
            </h1>
            <form onSubmit={handleSubmit} className="p-6 text-[#1f2937] space-y-4">
                <div className="flex flex-col items-start w-full">
                <label className="block text-sm font-medium">
                    Username:
                </label>
                <input
                    type="text"
                    name="username"
                    value={inputs.username}
                    onChange={handleChange}
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
                <label className="block text-sm font-medium ">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={inputs.email}
                    onChange={handleChange}
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
                <label className="block text-sm font-medium ">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
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
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="cnfmpass"
                    value={inputs.cnfmpass}
                    onChange={handleChange}
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
                <p className="text-sm text-center text-[#6f1a07]!">
                    {error}
                </p>
                )}

                <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center
                        w-full bg-[#9381FF] 
                        text-[#f8f7ff]
                        py-2 rounded-md
                        font-medium
                        hover:opacity-90
                        transition-colors duration-300"
                >
                {loading ? <Spinner/> : "Register"}
                </button>

            </form>

            <p className="text-center text-sm text-[#2b2118]">
                Already have an account?{" "}
                <Link to="/login" className="font-medium underline! hover:opacity-80">
                Login
                </Link>
            </p>

            </div>
        </div>
    )

}

export default Register