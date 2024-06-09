import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

export const config = {
  runtime: 'experimental-edge',
};

export async function POST(req) {
  const { email, password, username, walletId } = await req.json();  

  console.log('Received value');
  console.log('email', email);
  console.log('password', password);
  console.log('username', username);
  console.log('walletid', walletId);

  return new Promise((resolve, reject) => {
    console.log('Opening database...');
    const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(new Response(JSON.stringify({ error: 'Failed to open database' }), { status: 500 }));
        return;
      }
    });

    console.log('Checking if user already exists...');
    db.get("SELECT email FROM Users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        console.error('Database query error:', err);
        db.close();
        reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        return;
      }
      if (row) {
        console.log('User already exists');
        db.close();
        reject(new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 }));
        return;
      }
      
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      console.log('Inserting new user into database...');
      db.run("INSERT INTO Users (username, email, password_hash, wallet_id) VALUES (?, ?, ?, ?)", 
        [username, email, password_hash, walletId], function(err) { 
        db.close();
        if (err) {
          console.error('Error inserting user:', err);
          reject(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
        } else {
          console.log('User registered successfully');
          resolve(new Response(JSON.stringify({ 
            message: 'User registered successfully', 
            walletAddress: walletId 
          }), { status: 201 }));
        }
      });
    });
  });
}
