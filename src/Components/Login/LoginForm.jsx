import React from 'react';

export default function LoginForm() {

    return (
        <div className='h-[calc(100vh-76px)] w-full flex items-center justify-center'>
            <form className='border-2 rounded-lg border-black p-10'>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input id='username' type='text' />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' />
                </div>
                <button>Log In</button>
            </form>

        </div>
    )
} 