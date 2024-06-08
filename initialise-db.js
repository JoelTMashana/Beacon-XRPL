const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Database connected!');

    db.serialize(() => {
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE)", (err) => {
            if (err) {
                console.error("Error creating table", err.message);
            } else {
                console.log("Table users created");

                // Insert a sample user
                db.run("INSERT INTO users (name, email) VALUES (?, ?)", ['Alice', 'alice@example.com'], function(err) {
                    if (err) {
                        console.error("Error inserting user", err.message);
                    } else {
                        console.log(`A row has been inserted with rowid ${this.lastID}`);
                    }
                });
            }
        });
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing database', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
