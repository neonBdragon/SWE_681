const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const ArithmeticGame = require('./ArithmeticGame');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const https = require("https");
const bcrypt = require("bcrypt");
const config = require('./config.js');
const env = require('dotenv').config();
const helmet = require("helmet");
console.log(config);
const salt = 10;
//express app declaration
const app = express();
const Crypto = require('crypto')
function genuuid(size = 128) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .replace(/\//g,'_') //Replaces / with _
        .replace(/\+/g,'-') //Replaces + with -
        .slice(0, size)
}
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

// CSRF
app.use(cookieParser());

// CSP Header
app.use(function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy-Report-Only',
        "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self' styles/main.css; frame-src 'self'"
    );
    next();
});

// Cross-Domain Configuration
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.disable('x-powered-by')
app.use(helmet());

//indicates the secret key and cert to use for the session; self signed certificate.
const options = {
    key: fs.readFileSync('../../ssl/server.key'),
    cert: fs.readFileSync('../../ssl/server.crt')
};

//creates an https server with the self signed certificate and key
//const server = http.createServer(options, app); //This server declaration caused issues for reasons I don't understand
const server = https.createServer(options, app).listen(process.env.SERVER_PORT, function () {
    console.log('Arithmetic Game started on 443! Go to https://localhost:443')
});
//creates socketio connection that a client can connect to.
const io = socketio(server);
const sessionMiddleware = session({
    genid: function(req) {
        return genuuid(); // use UUIDs for session IDs
    },
    secret: config.secret,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 600000 // Time is in miliseconds
    },
    resave: true,
    saveUninitialized: true
});
io.use(function (sock, next) {
    sessionMiddleware(sock.request, sock.request.res, next);
});


//Database used by the server with credentials passed in from a decrypted shell/bash script
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
//Initiating a database connection
db.connect(function (error) {
    if (!!error) {
        throw error;
    }
    console.log('mysql connected');
});
//Variables and regex function used for handling events during a connection.
let waitingPlayer = null;
let waitingUser = null;
var chats = [];
var chatsocks = [];
app.use(express.static('./'));
var users = [];
var usersocks = [];
const loginregex = new RegExp("^([A-Za-z0-9_@./#&+-]{8,32})$");
const userReg = new RegExp("^([A-Za-z0-9])+$")
var gameUsers = [];
var messages = [];
//Handling client connections and events.
io.on('connection', (sock) => {
    var req = sock.request;
    if (req.session.userID != null) {
        var userId = req.session.userID;
        var sql = "SELECT * FROM accounts WHERE id=" + db.escape(userID);
        db.query(sql, function (err, rows, fields) {
            if (error) throw error;
            io.emit("logged_in", {user: rows[0].Username});
        });
    }
//login verification
    sock.on("log", (data) => {

        var allGood = false;
        var found = false;
        var inall = false;
        user = data[0];
        pass = data[1];
        var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);
        if (loginregex.test(pass) == true && userReg.test(user) == true && user != pass) {

            db.query(sql, function (err, rows, fields) {
                if (rows.length == 0) {
                    console.log("nothing here");
                    sock.emit("No User", "Invalid Password and/or Username!");

                    //io.emit("logged_in", {user: user});
                    //});
                } else {
                    console.log("here");
                    var found = true;
                }
                if (found && !(users.includes(user))) {
                    const dataUser = rows[0].username;
                    const dataPass = rows[0].password;
                    const dataWin = rows[0].Wins;
                    const dataLoss = rows[0].Losses;
                    bcrypt.compare(pass, dataPass, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        if (res) {

                            if (dataPass == null || dataUser == null) {
                                sock.emit("No User", "Invalid Password and/or Username!");
                                console.log("Error");
                            }
                            if (user == dataUser && res == true) {
                                sock.emit("No User", "Successful Sign In!");
                                req.session.userID = rows[0].id;
                                req.session.save();
                                req.session.save();
                                console.log("session id saved");
                                allGood = true;
                            } else {
                                sock.emit("No User", "Invalid Password and/or Username!");
                                console.log("invalid session");
                            }
                        } else {
                            // response is OutgoingMessage object that server response http request
                            console.log("Invalid username, password");
                            sock.emit("No User", "Invalid Password and/or Username!");

                        }

                        if (allGood == true) {
                            users.push(dataUser);
                            usersocks.push(sock);
                            gameUsers.push(dataUser);
                            console.log(users);

                            //io.emit("unhide waiting", dataUser);
                            //sock.emit("unhidew", "unhide");


                            if (waitingPlayer) {

                                sock.emit("unhide");
                                chats.push([waitingUser, dataUser]);
                                console.log(chats);
                                chatsocks.push([waitingPlayer, sock]);
                                new ArithmeticGame(waitingPlayer, sock, db, gameUsers);
                                waitingPlayer = null;
                                waitingUser = null;
                                gameUsers = [];
                            } else {
                                waitingPlayer = sock;
                                waitingUser = dataUser;
                                waitingPlayer.emit("unhide");
                                waitingPlayer.emit('message', 'Waiting for an opponent');
                            }


                        }

                    });


                }
                if (found && users.includes(user)) {
                    console.log("This user is already logged in!");
                    sock.emit("No User", "Invalid Password and/or Username!");
                }
            });
        } else {
            console.log("invalid username");
            sock.emit("No User", "Invalid Password and/or Username!");
        }

    });
//creating a new account
    sock.on('New', (text) => {
        console.log('Hello new')
        user = text[0];
        pass = text[1];
        var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);

        db.query(sql, function (err, rows, fields) {
            if (rows.length == 0 && loginregex.test(pass) == true && userReg.test(user) == true && user != pass) {
                console.log("nothing here, good to sign up");

                bcrypt.hash(pass, salt, function (err, hash) {
                    if (err) console.log(err);
                    pass = hash;
                    //shows hashed password
                    sql = "INSERT into accounts (username, password) VALUES (" + db.escape(user) + ", " + db.escape(pass) + ")";

                    var query = db.query(sql, function (error, results, fields) {
                        if (error) throw error;
                        // Neat!
                    });

                    //db.query(sql, function(err, rows, fields){});
                    console.log("New Account!");
                    sock.emit("No User", "Successful Registration. Please sign in above");
                    //io.emit("logged_in", {user: user});
                    //});
                    //>>query logic should go here.
                });

            } else {
                sock.emit("No User", "Please use a novel username and a password that is at least 8 characters and no more than 32 characters.");

                var found = true;

            }
        });
    });
//listening for message event and passing it to the appropriate socket.
    sock.on('message', (text) => {
        var x = text.split(":");
        var u = x[0];
        var i = null;
        var index = null;
        console.log(u);
        for (i = 0; i < chats.length; i++) {
            if (chats[i][0] === u || chats[i][1] === u) {
                index = i;
            }
        }
        //chats.some(row => row.includes(u))
        if (index != null) {

            console.log(index);
            if (text.includes("Bet-")) {
                var a = text.split("-");
                var b = parseFloat(a[1]);
                chatsocks[index][0].emit('Bet', b);
                chatsocks[index][1].emit('Bet', b);
                chatsocks[index][0].emit('message', 'bet is in! ' + b);
                chatsocks[index][1].emit('message', 'bet is in! ' + b);
                //io.emit('Bet', b);
                //io.emit('message', 'bet is in! ' + b);
            }
            //io.emit('message', text);
            chatsocks[index][0].emit('message', text);
            chatsocks[index][1].emit('message', text);
        } else {
            console.log("User not in system and/or not in same game");
        }
    });
    //sending an outcome message
    sock.on('outcome', (text) => {
        io.emit('outcome', text);
    });
    //sending message to a losing player
    sock.on('loser', (text) => {
        io.emit('loser', text);
    });
    //Reseting game
    sock.on('reset', (text) => {
        io.emit('reset', text);
    });
    //Removing a user
    sock.on('remove user', (text) => {

        index = -1;
        index2 = -1;
        for (i = 0; i < users.length; i++) {
            console.log(users[i]);
            if (users[i] === text) {
                index = i;
            }
        }
        for (i = 0; i < chats.length; i++) {
            console.log(chats[i]);
            if (chats[i][0] === text || chats[i][1] === text) {
                index2 = i;
            }
        }
        console.log(index);
        console.log(index2);
        console.log(chats);
        //console.log(chatsocks);
        console.log(users);
        //console.log(usersocks);
        if (index != -1) {

            users.splice(index, 1);
            usersocks.splice(index, 1);
        }
        if (index2 != -1) {
            chats.splice(index2, 1);
            chatsocks.splice(index2, 1);
        }

        //users = users.filter(e => e !== text);
        //usersocks = usersocks.filter(e => e !== usersocks[index]);
        console.log(chats);
        //console.log(chatsocks);
        console.log(users);
        //console.log(usersocks);


    });


});

server.on('error', (err) => {
    console.error('Server error:', err);
});

/*server.listen(8080, () => {
  console.log('RPS started on 8080! Go to https://localhost:8080');
});*/ // Not needed as added listen to the server declaration
