const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const RpsGame = require('./rps-game');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const https = require("https");
const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const options = {
    key: fs.readFileSync('../../ssl/server.key'),
    cert: fs.readFileSync('../../ssl/server.crt')
};

//const server = http.createServer(options, app); //This server declaration caused issues for reasons I don't understand
const server = https.createServer(options, app).listen(8080, function () {
    console.log('RPS started on 8080! Go to https://localhost:8080')
});

const io = socketio(server);
const sessionMiddleware = session({
  secret: "keyboard cat"
});
io.use(function (sock, next){
    sessionMiddleware(sock.request, sock.request.res, next);
});
const config = {
  "host": "localhost",
  "user": "root",
  "password": 'Lina&$thatsmyhoney2019',
  "base": 'login_info'
};

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

db.connect(function (error){
    if(!!error){
        throw error;
    }
    console.log('mysql connected');
});
let waitingPlayer = null;
app.use(express.static('./'));
var users = [];
var usersocks = [];

function regexCheck(username, password) {
    //[0-9a-zA-Z]+
    let regex = /^[0-9a-zA-Z]+$/;
    let resUser = username.match(regex);
    let resPass = password.match(regex);
    if (resUser != null && resPass != null) return true;
    return false;
}

io.on('connection', (sock) => {
  var req = sock.request;
  if(req.session.userID != null){
      var userId = req.session.userID;
      var sql = "SELECT * FROM accounts WHERE id=" + db.escape(userID);
      db.query(sql, function(err, rows, fields){
        if(error) throw error;
        io.emit("logged_in", {user: rows[0].Username});
      });
    }

  sock.on("log", (data) => {
    var allGood = false;
    var found = false;
    var inall = false;
    user = data[0];
    pass = data[1];
    if(regexCheck(user, pass))
    {
        console.log("Passed Regex Test!");
        var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);
        db.query(sql, function(err, rows, fields){
            if(rows.length == 0){
                console.log("nothing here");
                sock.emit("No User","Invalid Password and/or Username!");

                //io.emit("logged_in", {user: user});
                //});
            }else{
                console.log("here");
                var found = true;
            }
            if(found && !(users.includes(user))){
                const dataUser = rows[0].username;
                const dataPass = rows[0].password;
                if(dataPass == null || dataUser == null){
                    sock.emit("No User", "Invalid Password and/or Username!");
                    console.log("Error");
                }
                if(user == dataUser && pass == dataPass){
                    sock.emit("No User", "Successful Sign In!");
                    req.session.userID = rows[0].id;
                    req.session.save();
                    req.session.save();
                    console.log("session id saved");
                    allGood = true;

                }else{
                    sock.emit("No User", "Invalid Password and/or Username!");
                    console.log("invalid session");
                }
                if(allGood == true){
                    users.push(dataUser);
                    console.log(users);
                    usersocks.push(sock);
                    //io.emit("unhide waiting", dataUser);
                    //sock.emit("unhidew", "unhide");
                    console.log(dataUser);

                    if (waitingPlayer) {
                        sock.emit("unhide");
                        new RpsGame(waitingPlayer, sock);
                        waitingPlayer = null;
                    } else {
                        waitingPlayer = sock;
                        waitingPlayer.emit("unhide");
                        waitingPlayer.emit('message', 'Waiting for an opponent');
                    }


                }
            }
            if(found && users.includes(user)){
                console.log("This user is already logged in!");
                sock.emit("No User", "Invalid Password and/or Username!");
            }
        });
    }
    else
    {
        console.log("Failed Regex Test!");
    }
  });
  sock.on('New', (text) =>{
    user = text[0];
    pass = text[1];
    if(regexCheck(user, pass)) {
          console.log("Passed Regex Test!");
          var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);
          db.query(sql, function (err, rows, fields) {
              if (rows.length == 0) {
                  console.log("nothing here, good to sign up");
                  console.log(user);
                  console.log(pass);
                  sql = "INSERT into accounts (username, password) VALUES (" + db.escape(user) + ", " + db.escape(pass) + ")";
                  var post = {username: user, password: pass};
                  var query = db.query('INSERT INTO accounts SET ?', post, function (error, results, fields) {
                      if (error) throw error;
                      // Neat!
                  });
                  console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL
                  db.query(sql, function (err, rows, fields) {
                  });
                  console.log("New Account!");
                  sock.emit("No User", "Successful Registration. Please sign in above");
                  //io.emit("logged_in", {user: user});
                  //});
              } else {
                  console.log("here");
                  var found = true;
                  sock.e
              }
          });
      }
  });
  sock.on('join', (text) =>{
    var user = text[0];
    var user2 = text[1];
    var userIndex1 = -1;
    var userIndex2 = -1;
    for(i = 0; i < users.length; i++){
        console.log(users[i]);
        if(users[i] == user){
            userIndex1 = i;
        }
        if(users[i] == user2){
            userIndex2 = i;
        }

    }
    console.log("UserIndex1:" + userIndex1);
    console.log("UserINdex2:" + userIndex2);

    if(user != user2 && userIndex1 != -1 && userIndex2 != -1){
        io.emit("Ask to play", user);
        console.log("Emit!");
    }


  });
  sock.on('request', (text) => {
    var user = text[0];
    var user2 = text[1];
    var userIndex1 = -1;
    var userIndex2 = -1;
    for(i = 0; i < users.length; i++){
        console.log(users[i]);
        if(users[i] == user){
            userIndex1 = i;
        }
        if(users[i] == user2){
            userIndex2 = i;
        }

    }
    console.log(userIndex1);
    console.log(userIndex2);
    var usersock1 = usersocks[userIndex1];
    var usersock2 = usersocks[userIndex2];
    if(text[2] == "yes"){
        io.emit("unhide");
        new RpsGame(usersock1, usersock2);
        console.log("Game Start!");
    }
  });
  sock.on('response', (text) => {
      if(text == 'yes'){
        sock.emit('play', 'yes');
      }

  });
  sock.on('message', (text) => {
    if(text.includes("Bet ")){
        var a = text.split(" ");
        var b = parseFloat(a[1]);
        sock.emit('Bet', b);
        io.emit('message', 'bet is in! ' + b);
    }
    io.emit('message', text);
  });
  sock.on('outcome', (text) => {
    io.emit('outcome', text);
  });
  sock.on('loser', (text) => {
      io.emit('loser', text);
  });
  sock.on('reset', (text) => {
        io.emit('reset', text);
  });
  sock.on('remove user', (text) => {
           console.log("Before");
           console.log(usersocks.length);
           index = -1;
           for(i = 0; i < users.length; i++){
                      console.log(users[i]);
                      if(users[i] = text){
                        index = i;
                      }
           }
          users = users.filter(e => e !== text);
          usersocks = usersocks.filter(e => e !== usersocks[index]);

          console.log("After");
          console.log(usersocks.length);
          for(i = 0; i < users.length; i++){
            console.log(users[i]);
          }
  });



});

server.on('error', (err) => {
  console.error('Server error:', err);
});

/*server.listen(8080, () => {
  console.log('RPS started on 8080! Go to https://localhost:8080');
});*/ // Not needed as added listen to the server declaration