"use client"

import { useState } from 'react';
// import { useRouter } from 'next/router';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.href = '/board';
        } else {
            const result = await response.json();
            setErrorMessage(result.error);  
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            {errorMessage && <div>{errorMessage}</div>}
            <button type="submit">Login</button>
        </form>
    );
}
