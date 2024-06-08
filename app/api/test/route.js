import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';

export async function GET() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                reject(NextResponse.json({ error: 'Failed to connect to the database' }, { status: 500 }));
            } else {
                db.all("SELECT * FROM users", [], (err, rows) => {
                    if (err) {
                        reject(NextResponse.json({ error: err.message }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json({ users: rows }, { status: 200 }));
                    }
                    db.close();
                });
            }
        });
    });
}

