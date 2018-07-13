const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const db = require('./db');
const bodyParser = require('body-parser');
const csurf = require('csurf');
const s3 = require('./s3');
const config = require('./config');
const multer      = require('multer');
const uidSafe     = require('uid-safe');
const path        = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 20971520
    }
});

const cookieSessionMiddleware = cookieSession( {
    secret: `secret is secret`,
    maxAge: 99999999999
});
app.use(compression());
app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(require("body-parser").urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});


if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}



app.post('/register', (req, res) => {
    const {password, first, last, email} = req.body;
    db.hashPassword(password)
        .then((hashedPassword) => db.toRegister(first, last, email, hashedPassword)
        )
        .then(function(result) {
            req.session.first = result.rows[0].first;
            req.session.last = result.rows[0].last;
            req.session.userId = result.rows[0].id;
        })
        .then(function() {
            res.json({
                success: true
            });}).catch(function(err) {
            console.log(err);
        });
});

app.post('/login', (req, res) => {
    let first, last, id, image;
    db.getUserByEmail(req.body.email)
        .then(function(result){
            // console.log(result);
            if (result) {
                first = result.rows[0].first;
                last = result.rows[0].last;
                id = result.rows[0].id;
                image = result.rows[0].image;
                return db.checkPassword(req.body.password, result.rows[0].password);
            } else {
                return;
            }
        }).then(function(result) {

            if(result == false) {
                throw new Error();
            } else {
                req.session.first = first;
                req.session.last = last;
                req.session.userId = id;
                req.session.image = image;
                res.json({
                    success: true
                });
            }
        }).catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('/user', (req, res) => {
    db.getUserById(req.session.userId).then(function(result) {
        res.json(result.rows[0]);
    });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    db.saveImage(req.session.userId, config.s3Url + req.file.filename)
        .then(function(result) {
            res.json(result.rows[0].image);
        }).catch(function(err) {
            console.log('error in upload', err);
        });
    console.log('Image uploaded successfully');
});

app.get('/bio', function(req, res) {
    db.getUserById(req.session.userId).then(function(results) {
        res.json({
            bio: results.rows[0].bio
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.post('/bio', function(req, res) {
    db.addBio(req.session.userId, req.body.bio).then(function() {
        res.json({
            success: true,
            bio: req.body.bio
        });
    }).catch(function(err) {
        console.log(err);
    });
});

app.get('/users/:id.json', function(req, res) {
    req.session.special_key = req.params.id.toString() + req.session.userId.toString();
    if (req.params.id == req.session.userId) {
        console.log('redirecting to profile');
        return res.json({
            redirectToProfile: true
        });
    }
    Promise.all([db.getUserById(req.params.id), db.getStatus(req.session.userId, req.params.id)])
        .then(([userInfo, friendStatusInfo]) => {
            // console.log(friendStatusInfo.rows, "friend status");
            res.json({
                success: true,
                id: userInfo.rows[0].id,
                first: userInfo.rows[0].first,
                last: userInfo.rows[0].last,
                email: userInfo.rows[0].email,
                image: userInfo.rows[0].image,
                bio: userInfo.rows[0].bio,
                sender_id: (friendStatusInfo.rows[0] && friendStatusInfo.rows[0].sender_id) || null,
                recipient_id: (friendStatusInfo.rows[0] && friendStatusInfo.rows[0].recipient_id) || null,
                status: (friendStatusInfo.rows[0] && friendStatusInfo.rows[0].status) || 0
            });
        }).catch(err => {
            console.log("error in get user id ", err);
        });
});

app.post('/sendfriendrequest/:recipient_id', (req, res) => {
    db.addFriend(req.session.userId, req.params.recipient_id, 1).then(results => {
        res.json({success: true, status: results.rows[0].status});
    });
});


app.post('/cancelfriendrequest/:recipient_id', (req, res) => {
    db.cancelFriendRequest(req.session.userId, req.params.recipient_id).then(results => {
        res.json({success: true, status: 0});
    });
});

app.post('/acceptfriendrequest/:recipient_id', (req, res) => {
    db.updateRequest(req.session.userId, req.params.recipient_id, 2).then(results => {
        // console.log('THIS are results ', results.rows[0]);
        res.json({success: true, status: results.rows[0].status});
    });
});

app.post('/removefriend/:recipient_id', (req, res) => {
    db.endFriendship(req.session.userId, req.params.recipient_id).then(results => {
        res.json({success: true, status: 0});
    });
});

app.get('/addfriends', (req, res) => {
    db.getFriendsList(req.session.userId).then(friends => {
        res.json({success: true, friends: friends.rows});
    }).catch(function(err){
        console.log(err);
    });
});

app.get("/users/search", function(req, res) {
    db.userSearch(req.query.q)
        .then(data => {
            // console.log(data.rows);
            res.json(data.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/logout', function(req, res) {
    req.session.userId = null;
    res.redirect("/");
});

app.get('*', function(req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

//get a list of everyone online using socketid and userid. object.keys and object.values


let onlineUsers = {};
io.on('connection', function(socket) {
    let userId = socket.request.session.userId;
    let userIds = Object.values(onlineUsers);
    onlineUsers[socket.id] = userId;

    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    db.getUsersByIds(Object.values(onlineUsers)).then(({rows}) => {
        socket.emit('onlineUsers', rows);
    });

    let count = Object.values(onlineUsers).filter(id => id == userId).length;
    if (count == 1) {
        db.getUserById(userId).then(user =>
            socket.broadcast.emit("userJoined", user.rows[0]));
    }

    db.getChatMessages().then(({ rows }) => {
        io.sockets.emit("chatMessages", rows.reverse());
    });

    socket.on("chatMessage", function(newMessage) {
        const userId = socket.request.session.userId;
        db.insertChatMessage(newMessage, userId).then(({ rows }) => {
            let chatId = rows[0].id;
            db.returnMessage(chatId).then(({ rows }) => {
                io.sockets.emit("chatMessage", rows[0]);
            });
        });
    });

    socket.on("disconnect", function() {
        let userIndex = userIds.indexOf(userId);
        let thisUserId = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        userIds.splice(userIndex, 1);
        if (userIds.indexOf(userId) == -1) {
            io.sockets.emit("userLeft", thisUserId);
        }
    });

    socket.on('thanks', function(data) {
        console.log(data);
    });

    socket.emit('welcome', {
        message: 'Welome. It is nice to see you'
    });

    // io.socket.emit("someoneshowedup") = send message to all connected
});
