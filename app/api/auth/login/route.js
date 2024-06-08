import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

export const config = {
  runtime: 'experimental-edge',
};

export async function POST(req) {
  const { email, password } = await req.json();

  const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE);
  return new Promise((resolve, reject) => {
    db.get("SELECT password_hash FROM Users WHERE email = ?", [email], async (err, row) => {
      db.close();
      if (err) {
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
      } else if (row) {
        const result = await bcrypt.compare(password, row.password_hash);
        if (result) {
          resolve(new Response(JSON.stringify({ message: 'Login successful' }), { status: 200 }));
        } else {
          reject(new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 }));
        }
      } else {
        reject(new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 }));
      }
    });
  });
}
