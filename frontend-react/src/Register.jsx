import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        cnfmpass: ""
    });
    const [error, setError] = useState("")

    async function reg({username, email, password, cnfmpass}) {
        const response = await fetch("http://localhost:5000/register", {
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
            return
        } else {
            alert(data.message)
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

        if (Object.values(inputs).some(value => !value.trim())) {
            setError("Fill all fields");
            return
        }
        reg(inputs)
    }

    return (
        <>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
            <label>Username:
                <input
                    type="text"
                    name="username"
                    value={inputs.username}
                    onChange={handleChange}
                />
            </label>
            <br/><br/>
            <label>Email:
                <input
                    type="email"
                    name="email"
                    value={inputs.email}
                    onChange={handleChange}    
                />
            </label>
            <br/><br/>
            <label>Password:
                <input
                    type="password"
                    name="password"
                    value={inputs.password}
                    onChange={handleChange}
                />
            </label>
            <br/><br/>
            <label>Confirm Password:
                <input
                    type="password"
                    name="cnfmpass"
                    value={inputs.cnfmpass}
                    onChange={handleChange}
                />
            </label>
            <br/><br/>
            {error && <p>{error}</p>}
            <br/>
            <button type="submit">Register</button>
        </form>
        <p>Already have an Account?<Link to="/login">Login</Link></p>
        </>
    )

}

export default Register