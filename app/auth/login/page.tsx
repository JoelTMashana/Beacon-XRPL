"use client"
import { useState } from 'react';
// import { useRouter } from 'next/router';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function CardWithForm() {
        // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [errorMessage, setErrorMessage] = useState('');
    // // const router = useRouter();

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     const response = await fetch('/api/auth/login', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ email, password })
    //     });

    //     if (response.ok) {
    //         window.location.href = '/board';
    //     } else {
    //         const result = await response.json();
    //         setErrorMessage(result.error);  
    //     }
    // };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="Password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>Sign in</Button>
      </CardFooter>
    </Card>
  )
}
