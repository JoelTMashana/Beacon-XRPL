import { NextResponse } from "next/server";

export async function GET(req) {
  console.log('reqhhh' , req);
  // Respond only to GET requests
  return NextResponse.json({ message: 'This is the response for GET requests.' });
}