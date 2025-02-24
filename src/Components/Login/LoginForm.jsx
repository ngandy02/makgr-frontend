import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    return (
        <div className='w-full flex items-center justify-center'>
            <form className='border-2 rounded-lg border-black p-10'>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder='Enter username' id='username' type='text' />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter password' id='password' type='password' />
                </div>
                <button>Log in</button>
                <div className='text-sm underline'><Link to={'/register'}>Create an account</Link></div>
            </form>

        </div>
    )
} 