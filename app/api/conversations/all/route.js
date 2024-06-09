import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';

export async function GET(req) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 }));
            } else {
                const query = `
                    SELECT 
                        c.conversation_id,
                        c.start_time,
                        c.end_time,
                        c.message_count,
                        initiator.username AS initiator_username,
                        participant.username AS participant_username
                    FROM 
                        Conversations c
                    JOIN 
                        Users initiator ON c.initiator_user_id = initiator.user_id
                    JOIN 
                        Users participant ON c.participant_user_id = participant.user_id
                    WHERE 
                        c.initiator_user_id = ? OR c.participant_user_id = ?
                    ORDER BY 
                        c.start_time DESC
                `;

                db.all(query, [userId, userId], (err, rows) => {
                    db.close();
                    if (err) {
                        reject(NextResponse.json({ error: err.message }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json({ conversations: rows }, { status: 200 }));
                    }
                });
            }
        });
    });
}
