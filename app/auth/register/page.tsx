"use client"
import { useState } from 'react';
import { Wallet, Client } from 'xrpl';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CardWithForm() {
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const client = new Client('wss://s.altnet.rippletest.net:51233');

        try {
            console.log('Connecting to wallet..');
            await client.connect();
            console.log('Connected');
            console.log('Funding wallet');
            const { wallet } = await client.fundWallet(); 
            console.log('Wallet Funded');

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, username, walletId: wallet.address })
            });

            if (response.ok) {
                window.location.href = '/auth/login';
            } else {
                console.log('Response on register', response);
                const result = await response.json();
                setErrorMessage(result.error);  
            }
        } catch (error) {
            console.error('Error with XRPL wallet creation:', error);
            setErrorMessage('Failed to create XRPL wallet.');
        } finally {
            client.disconnect(); // Ensure client is disconnected after operation
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input 
                                id="username" 
                                type="text" 
                                placeholder="username" 
                                value={username} 
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email"
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <CardFooter className="flex justify-between">
                        <Button type="submit">Register</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
}
