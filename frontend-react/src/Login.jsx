import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";

function Login({onSuccess}) {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("")
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
            return
        } else {
            alert("Login Successful!")
            onSuccess()
            navigate("/")
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
        if (!user.username.trim() || !user.password.trim()) {
            setError("fill all fields!")
            return;
        }
        Auth(user.username.trim(), user.password.trim())
    }


    return (
        <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <label>Username:
                <input 
                    type = "text"
                    name = "username"
                    value = {user.username}
                    onChange = {handleChange}
                />
            </label> 
            <br/> <br/>
            <label>Password:
                <input 
                    type = "password"
                    name = "password"
                    value = {user.password}
                    onChange = {handleChange}
                />
            </label>
            <br/><br/>
            {error && <p>{error}</p>}
            <button type = "submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register Here!</Link></p>
        </>
    )
}

export default Login