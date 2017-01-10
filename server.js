//Using express module 
var express = require("express");
//Express server instance
var app = express();
var port = process.env.PORT || 3000;


//Express server instance listening on specific port
app.listen(port, function() {
	console.log("Server listening on port ", port);
});
