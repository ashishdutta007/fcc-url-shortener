//Using express module 
var express = require("express");
//Express server instance
var app = express();
//require() returns module.exports{} object of the mentioned js 
var dbops = require('./mongodb.js');
var port = process.env.PORT || 3000;

//Express server object receiving a long url as a parameter
app.get('/new/*', function(request, response) {
    request.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });
    response.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });

    //Extract input Url from request stream
    //var longUrl = request.params[0];
    var longUrl = 'https://www.freecodecamp.com/challenges/url-shortener-microservice';

    //Validate Url format
    validateInputUrl(longUrl);

});

function validateInputUrl(url) {
    var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])(\/[-A-Za-z0-9@:%._\+~#=?]*)*/");
    var result = pattern.test(url);

    console.log('isValidUrl ? ', result);
}


//test data for now
var urlData = {
    originalLongUrl: 'test1------www.google.com-------1test',
    shortCode: 0
};

//Enter new url data to mongodb
dbops.enterNewUrlData(urlData);

//Express server instance listening on specific port
app.listen(port, function() {
    console.log("Server listening on port ", port);
});
