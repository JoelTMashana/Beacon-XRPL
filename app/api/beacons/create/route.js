import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';

export async function POST(req) {
    const { userId, content } = await req.json();

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 }));
            } else {
                db.run("INSERT INTO Beacons (user_id, content, timestamp) VALUES (?, ?, CURRENT_TIMESTAMP)", [userId, content], function(err) {
                    if (err) {
                        reject(NextResponse.json({ error: err.message }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json({ message: 'Beacon created successfully', beaconId: this.lastID }, { status: 201 }));
                    }
                    db.close();
                });
            }
        });
    });
}
