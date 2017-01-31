//Using express module 
var express = require("express");
//Express server instance
var app = express();
//require() returns module.exports{} object of the mentioned js 
var dbops = require('./mongodb.js');
var port = process.env.PORT || 3000;

//Express server object receiving a long url as a parameter
app.get('*/new/*', function(request, response) {
	request.on('error', function(error) {
		return console.log("An error has occurred ", error);
	});
	response.on('error', function(error) {
		return console.log("An error has occurred ", error);
	});

	//Extract input Url from request stream
	var longUrl = request.params[0];

	//Validate Url format
	if (validateInputUrl(longUrl) == 'true') {
		if (isDuplicateUrl(longUrl) == 'false') {
			console.log("Valid url for entry to db");

			//test data for now
			var urlData = {
				originalLongUrl: 'test1------www.google.com-------1test',
				shortCode: 0
			};

			//Enter new url data to mongodb
			dbops.enterNewUrlData(urlData);
		}
		else {
			return console.log();
		}
	}
	else {
		return console.log("Invalid url");
	}
});

//Validate format of input url
function validateInputUrl(url) {
	var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])(\/[-A-Za-z0-9@:%._\+~#=?]*)*/");
	var result = pattern.test(url);

	console.log('isValidUrl ?: ', result);
}

//Validate if url is a duplicate value
function isDuplicateUrl() {

}



//Express server instance listening on specific port
app.listen(port, function() {
	console.log("Server listening on port ", port);
});
