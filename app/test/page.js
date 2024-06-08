"use client"
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/test');
        setApiResponse(response.data.data); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiResponse('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>This is a Test Page</h1>
      <p>Welcome to the test page.</p>
      {apiResponse && <p>API Response: {apiResponse}</p>}
      <Link href="/">
        Go to home page
      </Link>
    </div>
  );
}
