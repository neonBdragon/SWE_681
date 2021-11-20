<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Your Title</title>
</head>
<body>
<div class="n_log_in">
  <input type="text" id="userName" placeholder="Username..." /><br>
  <input type="password" id ="Password" placeholder="Password..." /><br>
  <button id="Login_Register">Login / Register</button>
</div>

<div class="log_in" style="display: none;">
  text
</div>
</body>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="/socket.io/socket.io.js"></script>
<script>
  $(document).ready(function(){
  const socket = io();
  $("#Login_Register").click(function(){
  socket.emit("login_register", {
  user: $("#userName").val(),
  pass: $("#Password").val()
  });
  });
  });
  socket.on("logged_in", function(name){
  $("#n_log_in").hide();
  $("#log_in").html("Welcome back " + name + ", nice to see you again!");
  $("#log_in").show();
  });

  socket.on("invalid", function(){
    alert("Username / Password Invalid, Please try again!");
  });

  socket.on("error", function(){
    alert("Error: Please try again!");
  });
</script>

</html>