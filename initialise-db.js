const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();


// Connect to the SQLite database
const db = new sqlite3.Database('./mydb.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        return;
    }
    console.log('Database connected!');

    db.serialize(() => {
        // Users Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                email TEXT UNIQUE,
                password_hash TEXT,
                karma_score INTEGER,
                wallet_id TEXT,
                services_enabled BOOLEAN
            )
        `);

        // UserPins Table
        db.run(`
            CREATE TABLE IF NOT EXISTS UserPins (
                pin_id INTEGER PRIMARY KEY AUTOINCREMENT,
                pinner_user_id INTEGER,
                pinned_user_id INTEGER,
                FOREIGN KEY(pinner_user_id) REFERENCES Users(user_id),
                FOREIGN KEY(pinned_user_id) REFERENCES Users(user_id)
            )
        `);

        // Services Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Services (
                service_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                description TEXT,
                cost REAL,
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
        `);

        // Beacons Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Beacons (
                beacon_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                content TEXT,
                timestamp TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Conversations (
                conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                initiator_user_id INTEGER,
                participant_user_id INTEGER,
                beacon_id INTEGER,
                start_time TIMESTAMP,
                end_time TIMESTAMP,
                message_count INTEGER,
                FOREIGN KEY(initiator_user_id) REFERENCES Users(user_id),
                FOREIGN KEY(participant_user_id) REFERENCES Users(user_id),
                FOREIGN KEY(beacon_id) REFERENCES Beacons(beacon_id)
            )
        `);


        // Messages Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Messages (
                message_id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER,
                user_id INTEGER,
                message_content TEXT,
                timestamp TIMESTAMP,
                FOREIGN KEY(conversation_id) REFERENCES Conversations(conversation_id),
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
        `);

        // Promotions Table
        db.run(`
            CREATE TABLE IF NOT EXISTS Promotions (
                promotion_id INTEGER PRIMARY KEY AUTOINCREMENT,
                description TEXT,
                cost_in_tokens REAL,
                valid_until DATE
            )
        `);

        // Promotion Redemptions Table
        db.run(`
            CREATE TABLE IF NOT EXISTS PromotionRedemptions (
                promotion_id INTEGER,
                user_id INTEGER,
                redeemed_on TIMESTAMP,
                PRIMARY KEY (promotion_id, user_id),
                FOREIGN KEY(promotion_id) REFERENCES Promotions(promotion_id),
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
        `);

        // Sample users
        const users = [
            { username: 'alice', email: 'alice@example.com', password: 'password123', karma_score: 100, wallet_id: 'wallet001alice', services_enabled: 1 },
            { username: 'bob', email: 'bob@example.com', password: 'password456', karma_score: 75, wallet_id: 'wallet002bob', services_enabled: 1 }
        ];
    
        users.forEach(user => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password', err);
                    return;
                }
                db.run("INSERT INTO Users (username, email, password_hash, karma_score, wallet_id, services_enabled) VALUES (?, ?, ?, ?, ?, ?)",
                    [user.username, user.email, hash, user.karma_score, user.wallet_id, user.services_enabled], (err) => {
                        if (err) {
                            console.error("Error inserting user", err.message);
                        }
                    });
            });
        });

// Insert into UserPins
db.run("INSERT INTO UserPins (pinner_user_id, pinned_user_id) VALUES (?, ?)",
[1, 2]);
db.run("INSERT INTO UserPins (pinner_user_id, pinned_user_id) VALUES (?, ?)",
[2, 1]);

// Insert into Services
db.run("INSERT INTO Services (user_id, description, cost) VALUES (?, ?, ?)",
[1, 'Web Development Services', 300.50]);
db.run("INSERT INTO Services (user_id, description, cost) VALUES (?, ?, ?)",
[2, 'Graphic Design Services', 250.75]);

// Insert a beacon by Alice about Freshers' Week
db.run("INSERT INTO Beacons (user_id, content, timestamp) VALUES (?, ?, ?)",
[1, 'Really need some advice on how to survive Freshers Week!', '2023-06-01 10:00:00']);

// Assuming beacon_id for Alice's beacon is 1, initiate a conversation regarding that beacon
db.run("INSERT INTO Conversations (initiator_user_id, participant_user_id, beacon_id, start_time, end_time, message_count) VALUES (?, ?, ?, ?, ?, ?)",
[1, 2, 1, '2023-06-01 12:00:00', '2023-06-01 12:30:00', 8]);

// Insert messages into the conversation
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 1, 'Really need some advice on how to survive Freshers Week!', '2023-06-01 12:01:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 2, 'Keep it simple. Make sure you go to the introductory sessions, meet new people, and join a few societies that interest you.', '2023-06-01 12:02:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 1, 'That makes sense. What about managing the workload?', '2023-06-01 12:03:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 2, 'Don’t stress too much yet. Focus on getting organised, keep track of your schedule, and don’t be afraid to ask for help if you need it.', '2023-06-01 12:04:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 1, 'Thanks! Any tips on balancing social life and studies?', '2023-06-01 12:05:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 2, 'Yes, prioritise your time. Enjoy the social events but also set aside study time. Find a good balance early on.', '2023-06-01 12:06:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 1, 'Got it. Feeling more confident now. Thanks a lot!', '2023-06-01 12:07:00']);
db.run("INSERT INTO Messages (conversation_id, user_id, message_content, timestamp) VALUES (?, ?, ?, ?)",
[1, 2, 'Anytime! Enjoy Freshers Week!', '2023-06-01 12:08:00']);


// Insert into Promotions
db.run("INSERT INTO Promotions (description, cost_in_tokens, valid_until) VALUES (?, ?, ?)",
['Discount on web development services', 20.00, '2023-12-31']);
db.run("INSERT INTO Promotions (description, cost_in_tokens, valid_until) VALUES (?, ?, ?)",
['Discount on graphic design services', 15.00, '2023-12-31']);

// Insert into Promotion Redemptions
db.run("INSERT INTO PromotionRedemptions (promotion_id, user_id, redeemed_on) VALUES (?, ?, ?)",
[1, 1, '2023-06-01 12:10:00']);
db.run("INSERT INTO PromotionRedemptions (promotion_id, user_id, redeemed_on) VALUES (?, ?, ?)",
[2, 2, '2023-06-02 14:00:00']);

        console.log("Tables created and sample data inserted");
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing database', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
