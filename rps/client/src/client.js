const array = [];


const writeEvent = (text) => {

      // <ul> element
      const parent = document.querySelector('#events');

      // <li> element
      const el = document.createElement('li');
      el.innerHTML = text;

      parent.appendChild(el);

};

const noUser = (text) => {

      // <ul> element
      const parent = document.querySelector('#divlog');

      // <li> element
      const el = document.createElement('li');
      el.innerHTML = text;

      parent.appendChild(el);

};

const displayWinner = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
    parent.appendChild(el);
};
const playRequest = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = text;
    parent.appendChild(el);
    yesno.style.visibility = "visible";
};
const play = (text) => {
    if (text == "yes") {
      // Save it!
      var arr = [username, playwith, "yes"];
      sock.emit("request", arr);
    } else {
      // Do nothing!
      var arr = [username, playwith, "no"];
      sock.emit('request', arr);
    }
};
const waiting = (text) => {

      // <ul> element
      const parent = document.querySelector('#join-form');

      // <li> element
      var btn = document.createElement("BUTTON");
      btn.innerHTML = text;
      btn.id = text
      parent.appendChild(btn);
      const button = document.getElementById(btn.id);
      button.addEventListener('click', () => {
              var array = [username, text];
              playwith = text;
              sock.emit('join', array);
      });




};
const loser = (text) => {
    const parent = document.querySelector('#events');
    const el = document.createElement('li');
    el.innerHTML = "The losing value is:" + text;
    parent.appendChild(el);
    rem = document.getElementById(text);
    array.push(rem);
    rem.parentNode.removeChild(rem);
};

const reset = (text) => {
    rem = document.getElementById("Leave");
    array.push(rem);
    rem.parentNode.removeChild(rem);
    const parent = document.querySelector('#buttons');

      // <li> element
      for(i = 0; i < array.length; i++){
        parent.appendChild(array[i]);
      }

    //location.reload();
    //var login = document.getElementById("divlog");
    //login.style.visibility = "hidden";
    //game.style.visibility = "visible";
    sock.emit('message', 'New Match!');
};

const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message', username + ": " + text);
  if(text.includes("Bet-")){
    var a = text.split("-");
    var b = parseFloat(a[1]);
    sock.emit("Bet", b);
  }
};

const addButtonListeners = () => {

  ['200','150','100', '75', '50', '25', '10'].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener('click', () => {
        sock.emit('turn', id);
    });
  });
};
const addButtonListeners2 = () => {
  ['Login_Register', 'Leave', 'yes', 'no', 'Login_RegisterNew', 'Pause'].forEach((id) => {
    const button = document.getElementById(id);
    try {
        button.addEventListener('click', () => {
            if(id === 'Leave'){
                sock.emit("remove user", username);
                sock.emit("Leaving Game", username);
                location.reload();
            }else if(id === 'Login_Register'){
                var user = document.getElementById("userName").value;
                username = user;
                var pass = document.getElementById("Password").value;
                var data = [user, pass];
                sock.emit('log', data);
            }else if(id === 'Login_RegisterNew'){
                var user = document.getElementById("userNameNew").value;
                username = user;
                var pass = document.getElementById("PasswordNew").value;
                var data = [user, pass];
                sock.emit('New', data);
                document.getElementById("userNameNew").value = "";
                var pass = document.getElementById("PasswordNew").value = "";
            }else{
                if(id === 'Pause'){
                    sock.emit("Pause", username);
                }
            }
        });
    } catch (err) {
        console.log(err.message);
    }
  });
};
const gamepage = (e) => {
    login.style.visibility = "hidden";
    signup.style.visibility = "hidden";
    game.style.visibility = "visible";
    writeEvent('Welcome to RPS');
    writeEvent('New Match!');
};
const unhidew = (e) => {
    login.style.visibility = "hidden";
    wait.style.visibility = "visible";

};
const boot = (e) => {
    sock.emit("remove user", username);
    sock.emit("Leaving Game", username);
    location.reload();
};
var username = "";
var playwith = "";

const game = document.getElementById("div1");
const login = document.getElementById("divlog");
const signup = document.getElementById("divlog2");
game.style.visibility = "hidden";
const sock = io.connect();
sock.on('Booted', boot);
sock.on('play', play);
sock.on('message', writeEvent);
sock.on('outcome', displayWinner);
sock.on('unhide waiting', waiting);
sock.on('unhidew', unhidew);
sock.on('loser', loser);
sock.on('reset', reset);
sock.on('unhide', gamepage);
document
  .querySelector('#chat-form')
  .addEventListener('submit', onFormSubmitted);
sock.on("No User", noUser);
sock.on("Ask to play", playRequest);
addButtonListeners();
addButtonListeners2();
