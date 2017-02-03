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
    //Validate Url format and duplicate values
    if (validateInputUrl(longUrl) === true) {
        //Mongoose query.exec() function returns a promise
        isDuplicateUrl(longUrl).then(function(docs) {
            if (docs.length === 0) {
                console.log("Not duplicate url");
                var urlData;
                var counterPromise = dbops.getNextUrlCodeSequence('urlCode');
                counterPromise.then(function(docs) {
                        var urlCode = Number(docs[0].sequence_value);
                        console.log('urlCode', urlCode);
                        urlData = {
                            'originalLongUrl': longUrl,
                            'urlCode': urlCode
                        };

                        //save() function returns a promise
                        var savePromise = dbops.enterNewUrlData(urlData);
                        return savePromise;
                    })
                    //save() on returning value from callback
                    .then(function(docs) {
                        {
                            //URL shortening logic
                            //
                            console.log("Url " + docs.originalLongUrl + "is shortened and saved to db");
                            //Increment the globalUniqueUrlId by 1
                            //globalUniqueUrlId++;
                            response.status(200).json({
                                'originalURL': docs.originalLongUrl,
                                'urlCode': docs.urlCode,
                                'shortURL': ''
                            });
                        }
                        dbops.incrementCounter()
                            .then(function(docs) {
                                console.log("Docs : saved to collection counter", docs);
                            });
                    });
            } else {
                response.status(200).json({
                    'error': 'Duplicate value, URL already exists in db',
                    'url': longUrl
                });
                return console.log("Duplicate url exists in db");
            }
        });
    } else {
        response.status(500).json({
            'error': 'Invalid URL format, URL must comply to http(s)://(www.)domain.ext(/)(path)',
            'url': longUrl
        });
        return console.log("Invalid url format");
    }
});

//Validate format of input url
function validateInputUrl(url) {
    var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])(\/[-A-Za-z0-9@:%._\+~#=?]*)*/");
    var result = pattern.test(url);
    console.log("is validURL: ", result);
    return result;
}

//Validate if url is a duplicate value
function isDuplicateUrl(url) {
    return dbops.checkDuplicateData(url);
}

//Express server instance listening on specific port
app.listen(port, function() {
    console.log("Server listening on port ", port);
});

//handle errors in case of promises
//error handling overall
