const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mysql = require('mysql');
const RpsGame = require('./rps-game');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const https = require("https");
const bcrypt = require("bcrypt");
const salt = 10;
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
const loginregex = new RegExp("^([A-Za-z0-9]{8,32})$");
var gameUsers = [];
var messages = [];
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
    var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);
    if(loginregex.test(pass) == true && loginregex.test(user) == true && user != pass){

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
                const dataWin = rows[0].Wins;
                const dataLoss = rows[0].Losses;
                bcrypt.compare(pass, dataPass, function(err, res) {
                  if (err){
                    console.log(err);
                  }
                  if (res) {

                                    if(dataPass == null || dataUser == null){
                                      sock.emit("No User", "Invalid Password and/or Username!");
                                      console.log("Error");
                                    }
                                    if(user == dataUser && res == true){
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
                  } else {
                    // response is OutgoingMessage object that server response http request
                    console.log("Invalid username, password");
                    sock.emit("No User", "Invalid Password and/or Username!");

                  }

                    if(allGood == true){
                                      users.push(dataUser);
                                      console.log(users);
                                      usersocks.push(sock);
                                      gameUsers.push(dataUser);
                                      console.log(gameUsers);
                                      //io.emit("unhide waiting", dataUser);
                                      //sock.emit("unhidew", "unhide");
                                      console.log(dataUser);

                                      if (waitingPlayer) {

                                          sock.emit("unhide");
                                          new RpsGame(waitingPlayer, sock, db, gameUsers);
                                          waitingPlayer = null;
                                          gameUsers = [];
                                        } else {
                                          waitingPlayer = sock;
                                          waitingPlayer.emit("unhide");
                                          waitingPlayer.emit('message', 'Waiting for an opponent');
                                      }


                                  }

                });



            }
            if(found && users.includes(user)){
                console.log("This user is already logged in!");
                sock.emit("No User", "Invalid Password and/or Username!");
            }
            });
     }else{
        console.log("invalid username");
        sock.emit("No User", "Invalid Password and/or Username!");
     }

  });

  sock.on('New', (text) =>{
    console.log('Hello new')
    user = text[0];
    pass = text[1];
    var sql = "SELECT * FROM accounts WHERE username=" + db.escape(user);
    console.log(pass);
    console.log(loginregex.test(pass));

    db.query(sql, function(err, rows, fields){
            if(rows.length == 0 && loginregex.test(pass) == true && loginregex.test(user) == true && user != pass){
                console.log("nothing here, good to sign up");
                console.log(user);
                console.log(pass);
                bcrypt.hash(pass, salt, function(err, hash){
                                if(err) console.log(err);
                                pass = hash;
                                console.log(pass); //shows hashed password
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

            }else{
                sock.emit("No User", "Please use a novel username and a password that is at least 8 characters and no more than 32 characters.");
                console.log("here");
                var found = true;

            }
    });
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
