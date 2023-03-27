import { useState } from 'react'
import './LoginInterface.css'

function LoginInterface() {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    return (
        <div className="bg-red-500">
            <h3>Please log in</h3>
            <div>
                <label>E-mail</label>
                <input type="text" name="e-mail" defaultValue={login} value={login} onChange={event => setLogin(event.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input type="password" name="password" defaultValue={password} value={password} onChange={event => setPassword(event.target.value)}/>
            </div>
            <button >Log in</button>
            <button>Create an account</button>
        </div>
    );
}

export default LoginInterface