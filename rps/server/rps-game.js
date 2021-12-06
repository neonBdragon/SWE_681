class RpsGame {
//constructor that manages a game between two players
  constructor(p1, p2, db, gameUsers) {
  //Object parameters
    this.db = db;
    this.gameUsers = gameUsers;
    this.lostTurns1 = [];
    this.lostTurns2 = [];
    this.playerTurns1 = [];
    this.playerTurns2 = [];
    this._players = [p1, p2];
    this._player1money = 0.00;
    this._player2money = 0.00;
    this._turns = [null, null];
    this.answer1 = null;
    this.answer2 = null;
    this.list = ['*', '/', '+', '-'];
    this.operator = this.list[Math.floor(Math.random()*this.list.length)];
    this.val = Math.floor(Math.random() *(100 - 50)) + 50;
    this.count1 = 7;
    this.count2 = 7;
    this.moneypool = 0.00;
    this._sendToPlayers('Arithematic Guess Game Starts!');
    this._sendToPlayer(0, "You are Player 1");
    this._sendToPlayer(1, "You are Player 2");
    this._sendPlayerStats();
    this._sendToPlayers('If you want to bet, please type Bet <the value with no $>.');
    this._sendToPlayers('Value for the game: ' + this.val);
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });
      player.on('Bet', (bet) =>{
        this.moneypool = this.moneypool + bet;
      });


    });
  }
//sends a message to a particular player within the game.
  _sendToPlayer(playerIndex, msg) {

    this._players[playerIndex].emit('message', msg);
  }
//sends a message to all players playing a particular game.
  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }
//show the statistics of all players in the game.
  _sendPlayerStats() {
      var i = 0;
      var messages = [];
      this._players.forEach((player) => {
        for(i = 0; i < this.gameUsers.length; i++){
            var sql1 = "SELECT * FROM accounts WHERE username=" + this.db.escape(this.gameUsers[i]);
                    this.db.query(sql1, function(err, rows, fields){
                            var wins = rows[0].Wins;
                            var losses = rows[0].Losses;
                            var username = rows[0].username;
                            var stats = "User: " + rows[0].username + " Wins: " + rows[0].Wins + " Losses: " + rows[0].Losses;
                            player.emit("message", stats);
                            messages.push(stats);

            });
        }
      });
      this._sendToPlayers(messages[0]);
      this._sendToPlayers(messages[1]);
  }
//function that checks if a game or a round within a game is over, and if so shows who one the round and game if applicable.
  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);
    var n = this._checkGameOver();
    this._sendToPlayers(n);
  }
//Updates the win/loss record
  _update_wl(text){
      console.log('Hello new')
      var status = text[0];
      var user = text[1];
      var wins = 0;
      var loss = 0;
      var username = "";
      var sql = "";
      if(status == "win"){
      	sql = "UPDATE accounts SET Wins = Wins + 1 Where username=" + this.db.escape(user);
      }else{
  	    sql = "UPDATE accounts SET Losses = Losses + 1 Where username=" + this.db.escape(user);
      }

      this.db.query(sql, function(err, rows, fields){
          if(err){
             console.log("failed update of wins/loss");

             throw err;
          }else{
              console.log("Wins/Losses changed");


          }
      });
    }
//Checks if the round is over and sees if the entire game is over.
  _checkGameOver() {
    const turns = this._turns;
    var y = "No";
    var m = "";
    if (turns[0] && turns[1]) {
      this._sendToPlayers('Game over ' + turns.join(' : '));
      m = this._getGameResult();
      this._turns = [null, null];
      this._sendToPlayers('Next Round!!!!');
      this._sendToPlayers(this.count);
      y = "Yes"
    }
    if(m == "player1"){
        this.count1 = this.count1 - 1;
        this._sendToPlayers('Player 1 count ' + this.count1);
    }
    if(m == "player2"){
        this.count2 = this.count2 - 1;
        this._sendToPlayers('Player 2 count ' + this.count2);
    }
    if(this.count1 == 1 || this.count2 == 1){
        this._sendToPlayers('Match Over!!!!');
        this._sendToPlayers('Moves by Player 1');

        if(this.count1 == 1){
            this._update_wl(["loss", this.gameUsers[0]]);
            this._update_wl(["win", this.gameUsers[1]]);
            this._sendToPlayers('Player 2 Wins!');
            this._player2money = this._player2money + this.moneypool;
            this._sendToPlayers('Player 2 has won: $' + this.moneypool);
        }
        if(this.count2 == 1){
            this._update_wl(["win", this.gameUsers[0]]);
            this._update_wl(["loss", this.gameUsers[1]]);
            this._sendToPlayers('Player 1 Wins!');
            this._player1money = this._player1money + this.moneypool;
            this._sendToPlayers('Player 1 has won: $' + this.moneypool);
        }
        this._sendToPlayers("Player 1 Moves");
        var string = ""
        var i = 0;
        for(i = 0; i < this.playerTurns1.length; i++){
            string = string + " " + this.playerTurns1[i];
        }
        this._sendToPlayers(string);
        this._sendToPlayers("Player 2 Moves");
        var string = ""
        for(i = 0; i < this.playerTurns2.length; i++){
            string = string + " " + this.playerTurns2[i];
        }
        this._sendToPlayers(string);

        this.count1 = 7;
        this.count2 = 7;
        this.lostTurns1 = [];
        this.lostTurns2 = [];
        this.playerTurns1 = [];
        this.playerTurns2 = [];
        this.operator = this.list[Math.floor(Math.random()*this.list.length)];
        this.val = Math.floor(Math.random() *(100 - 50)) + 50;
        this._players.forEach((player) => {
              player.emit('reset', 'newMatch');
        });
        this._sendToPlayers('Arithematic Game Starts!!');
        this._sendToPlayer(0, "You are Player 1");
        this._sendToPlayer(1, "You are Player 2");
        this._sendPlayerStats();
        this._sendToPlayers('If you want to bet, please type Bet <the value with no $>.');
        this._sendToPlayers('Value for the game' + this.val);

    }
    return y;
  }
//Calculates the game result
  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0], "1");
    const p1 = this._decodeTurn(this._turns[1], "2");
    this.playerTurns1.push(p0);
    this.playerTurns2.push(p1);
    var outcome1 = -1;
    var outcome2 = -1;
    switch(this.operator){
        case '*':
            outcome1 = p0 * this.val;
            outcome2 = p1 * this.val;
            break;
        case '/':
            outcome1 = p0 / this.val;
            outcome2 = p1 / this.val;
            break;
        case '+':
            outcome1 = p0 + this.val;
            outcome2 = p1 + this.val;
            break;
        case '-':
            outcome1 = p0 - this.val;
            outcome2 = p1 - this.val;
            break;

    }
    var message = "";
    var wl = "";
    if(outcome1 == outcome2){
        this._sendToPlayers('Draw!');
    }else if(outcome1 > outcome2){
        wl = "Winning Value: " + outcome1 + "\nLosing Value: " + outcome2;
        this._sendWinMessage(this._players[0], this._players[1], this._turns[1], wl);
        this.lostTurns2.push(this._turns[1]);
        message = "player2";
    }else{
        wl = "Winning Value: " + outcome2 + " \nLosing Value: " + outcome1;
        this._sendWinMessage(this._players[1], this._players[0], this._turns[0], wl);
        this.lostTurns1.push(this._turns[0]);
        message = "player1";
    }
    return message;
  }
//Sends the outcome message to each player.
  _sendWinMessage(winner, loser, losing_turn, wl) {
    winner.emit('message', 'You won!');
    winner.emit('outcome', 'You da best!');
    loser.emit('message', 'You lost.');
    loser.emit('message', 'Yolo' + losing_turn);
    loser.emit('outcome', losing_turn);
    loser.emit('loser', losing_turn);
    this._sendToPlayers(wl);
  }
//decodes the turn sent by the client
  _decodeTurn(turn, player) {
    if(player == "1" && this.lostTurns1.includes(turn)){
        throw new Error(`This value has already been lost by the player`);
    }else if(player == "2" && this.lostTurns2.includes(turn)){
        throw new Error(`This value has already been lost by the player`);
    }else{
        switch (turn) {
          case '200':
            return 200;
          case '150':
            return 150;
          case '100':
            return 100;
          case '75':
            return 75;
          case '50':
            return 50;
          case '25':
            return 25;
          case '10':
            return 10;
          default:
            throw new Error(`Could not decode turn ${turn}`);
        }
    }
  }




}

module.exports = RpsGame;

