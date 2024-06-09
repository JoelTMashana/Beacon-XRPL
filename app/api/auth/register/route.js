import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

export const config = {
  runtime: 'experimental-edge',
};

export async function POST(req) {
  const { email, password, username } = await req.json();

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(new Response(JSON.stringify({ error: 'Failed to open database' }), { status: 500 }));
      }
    });

    db.get("SELECT email FROM Users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        db.close();
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      } else if (row) {
        db.close();
        reject(new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 }));
      } else {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        db.run("INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, password_hash], function(err) {
          db.close();
          if (err) {
            reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
          } else {
            resolve(new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 }));
          }
        });
      }
    });
  });
}
