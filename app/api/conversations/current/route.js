import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';

export async function GET(req) {
    const conversationId = req.nextUrl.searchParams.get("conversationId");

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 }));
                return;
            }

            const query = `
                SELECT 
                    message_id,
                    user_id,
                    message_content,
                    timestamp
                FROM 
                    Messages
                WHERE 
                    conversation_id = ?
                ORDER BY 
                    timestamp;
            `;

            db.all(query, [conversationId], (err, messages) => {
                db.close();
                if (err) {
                    reject(NextResponse.json({ error: err.message }, { status: 500 }));
                } else {
                    resolve(NextResponse.json({ messages: messages }, { status: 200 }));
                }
            });
        });
    });
}
