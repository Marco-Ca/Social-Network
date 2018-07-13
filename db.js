const spicedPg  = require("spiced-pg"),
    bcrypt      = require('bcryptjs'),
    db          = spicedPg("postgres:postgres:postgres@localhost:5432/socialnetwork");

function toRegister(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4) returning *`,
        [first || null, last || null, email || null, password || null]
    );
}

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                return resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

function getUserByEmail(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
}

function getUserById(id) {
    return db.query(`SELECT id, first, last, image, bio FROM users WHERE id=$1`,
        [id]
    );
}

function saveImage(id, imgUrl) {
    return db.query(
        `UPDATE users SET image = $2 WHERE id = $1 RETURNING image`,
        [id || null, imgUrl]
    );
}

function addBio(id, bio) {
    return db.query ('UPDATE users SET bio=$2 WHERE id=$1 RETURNING bio',[id, bio]);
}

function getBio (email) {
    return db.query('SELECT * FROM users WHERE email=$1', [email]);
}

function getStatus (senderId, recipientId) {
    return db.query(`SELECT status, sender_id, recipient_id
                    FROM friendships
                    WHERE (recipient_id = $1 OR sender_id = $1)
                    AND (recipient_id = $2 OR sender_id = $2)
                    AND (status = 1 or status = 2)
                    `, [senderId, recipientId]);
}

function addFriend(senderId, recipientId, status) {
    return db.query(`INSERT INTO friendships (sender_id, recipient_id, status)
                    VALUES ($1, $2, $3)
                    RETURNING status, recipient_id, sender_id
                    `, [senderId, recipientId, status]);
}

function updateRequest(senderId, recipientId, status) {
    return db.query(`UPDATE friendships
                    SET status = $3
                    WHERE (recipient_id = $1 AND sender_id = $2)
                    OR (recipient_id = $2 AND sender_id = $1)
                    RETURNING status, recipient_id, sender_id`, [senderId, recipientId, status]);
}

function cancelFriendRequest(senderId, recipientId) {
    return db.query(`DELETE from friendships
        WHERE (recipient_id = $2 AND sender_id = $1)`,[senderId, recipientId]
    );
}

function endFriendship(senderId, recipientId) {
    return db.query(
        `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [senderId, recipientId]
    );
}

function getUsersByIds(arrayOfIds) {
    return db.query(`SELECT * FROM users WHERE id = ANY($1)`, [arrayOfIds]);
}

function getFriendsList(userId) {
    return db.query(`SELECT users.id, first, last, image, status
        FROM friendships
        JOIN users
        ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)`, [userId]);
}

function getChatMessages() {
    return db.query(
        `SELECT chat.id, chat.content, chat.user_id, chat.created_at, users.first, users.last, users.image
        FROM chat JOIN users ON chat.user_id=users.id ORDER BY chat.id DESC LIMIT 10`
    );
}

function insertChatMessage(content, userId) {
    return db.query(
        `INSERT INTO chat (content, user_id) VALUES ($1, $2) RETURNING *`,
        [content || null, userId || null]
    );
}

function returnMessage(id) {
    return db.query(
        `SELECT chat.id, chat.user_id, first, last, image, content, chat.created_at FROM chat
        LEFT JOIN users
        ON users.id = chat.user_id
        WHERE chat.id = $1

        `, [id]
    );
}

function userSearch(search) {
    return db.query(
        `SELECT id, first, last, image FROM users
                    WHERE first ILIKE  $1 OR last ILIKE  $1`,
        [search + "%"]
    );
}



module.exports = {
    toRegister,
    hashPassword,
    checkPassword,
    getUserByEmail,
    getUserById,
    saveImage,
    addBio,
    getBio,
    getStatus,
    addFriend,
    updateRequest,
    getUsersByIds,
    getFriendsList,
    getChatMessages,
    insertChatMessage,
    returnMessage,
    cancelFriendRequest,
    endFriendship,
    userSearch,

};
