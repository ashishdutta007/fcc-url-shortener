//Using express module 
var express = require("express");
//Express server instance
var app = express();
//require() returns module.exports{} object of the mentioned js 
var dbops = require('./mongodb.js');
var port = process.env.PORT || 3000;

console.log("Node Express Server");

//Express server object receiving a long url as a parameter
app.get('/new/*', function(request, response) {
    request.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });
    response.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });
    //Extract input Url from request stream
    var longUrl = request.params[0];
    //Validate Url format
    if (validateInputUrl(longUrl) === true) {
        //console.log("isDuplicateUrl(longUrl): ", isDuplicateUrl(longUrl));
        isDuplicateUrl(longUrl).then(function(docs) {
            if (docs.length === 0) {
                console.log('Inside ');
                //Hardcoded shortCode value in json object
                var urlData = {
                    'originalLongUrl': longUrl,
                    'shortCode': 0
                };
                var savePromise = dbops.enterNewUrlData(urlData);
                savePromise.then(function(docs) {
                    /*if (error) {
                        console.log("An error occured");
                    } else*/
                    {
                        console.log("Url " + docs.originalLongUrl + "is saved to db");
                    }
                });
            } else {
                console.log("Duplicate url exists in db");
                response.json({ 'error': 'Duplicate url exists in db' });
            }
        });
    } else {
        response.json({ 'error': 'Invalid url format' });
        return console.log("Invalid url format");
    }
});

//Validate format of input url
function validateInputUrl(url) {
    var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])(\/[-A-Za-z0-9@:%._\+~#=?]*)*/");
    var result = pattern.test(url);
    console.log('isValidUrl ?: ', result);
    return result;
}

//Validate if url is a duplicate value
function isDuplicateUrl(url) {
    console.log('Inside isDuplicateUrl');
    return dbops.checkDuplicateData(url);
}

//Express server instance listening on specific port
app.listen(port, function() {
    console.log("Server listening on port ", port);
});
