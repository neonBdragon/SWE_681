class RpsGame {

  constructor(p1, p2) {
    this._players = [p1, p2];
    this._turns = [null, null];
    this.list = ['*', '/', '+', '-'];
    this.operator = this.list[Math.floor(Math.random()*this.list.length)];
    this.val = Math.floor(Math.random() *(100 - 50)) + 50;
    this.count1 = 7;
    this.count2 = 7;
    this._sendToPlayers('Rock Paper Scissors Starts!');
    this._sendToPlayers('Value for the game: ' + this.val);
    this._players.forEach((player, idx) => {
      player.on('turn', (turn) => {
        this._onTurn(idx, turn);
      });

    });
  }

  _sendToPlayer(playerIndex, msg) {

    this._players[playerIndex].emit('message', msg);
  }

  _sendToPlayers(msg) {
    this._players.forEach((player) => {
      player.emit('message', msg);
    });
  }

  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);
    var n = this._checkGameOver();
    this._sendToPlayers(n);
  }

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
        this.count1 == 7;
        this.count2 == 7;
        this.operator = this.list[Math.floor(Math.random()*this.list.length)];
        this.val = Math.floor(Math.random() *(100 - 50)) + 50;
        this._players.forEach((player) => {
              player.emit('reset', 'newMatch');
        });
        this._sendToPlayers('Rock Paper Scissors Starts!');
        this._sendToPlayers('Value for the game' + this.val);

    }
    return y;
  }

  _getGameResult() {

    const p0 = this._decodeTurn(this._turns[0]);
    const p1 = this._decodeTurn(this._turns[1]);
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
    if(outcome1 == outcome2){
        this._sendToPlayers('Draw!');
    }else if(outcome1 > outcome2){
        this._sendWinMessage(this._players[0], this._players[1], this._turns[1]);
        message = "player2";
    }else{
        this._sendWinMessage(this._players[1], this._players[0], this._turns[0]);
        message = "player1";
    }
    return message;
  }

  _sendWinMessage(winner, loser, losing_turn) {
    winner.emit('message', 'You won!');
    winner.emit('outcome', 'You da best!');
    loser.emit('message', 'You lost.');
    loser.emit('message', 'Yolo' + losing_turn);
    loser.emit('outcome', losing_turn);
    loser.emit('loser', losing_turn);
  }

  _decodeTurn(turn) {
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

module.exports = RpsGame;

