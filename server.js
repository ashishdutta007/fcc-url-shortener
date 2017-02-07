//Using express module 
var express = require("express");
//Express server instance
var app = express();
//require() returns module.exports{} object of the mentioned js 
var dbops = require('./mongodb.js');
var shortjs = require('./shortener.js');
var port = process.env.PORT || 3000;

console.log("Node Express Server");

//Serving static UI files
//Pass the name of the lookup directory containing the static files
//Express.static() looks for all the files relative to the directory to match the filename in URL request 
app.use(express.static(__dirname + '/views'));

//Express server object on get reuests with long URL as parameter
app.get('/new/*', function(request, response) {
    request.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });
    response.on('error', function(error) {
        return console.log("An error has occurred ", error);
    });
    //Extract input URL from request stream
    var longUrl = request.params[0];
    //var urlCode;
    //Validate URL format and duplicate values
    if (validateInputUrl(longUrl) === true) {
        console.log("--A valid URL--");
        //Mongoose query.exec() function returns a Promise
        isDuplicateUrl(longUrl).then(function(docs) {
            if (docs.length === 0) {
                console.log("--Not a duplicate URL--");
                var urlData;
                //Get the 'urlCode sequence value' for new urlData entry
                var counterPromise = dbops.getLatestUrlCodeSequence('urlCode');
                //On Promise return of queried docs
                counterPromise.then(function(docs) {
                        var urlCode = Number(docs[0].sequence_value);
                        //URL shortening logic
                        //
                        var shortUrl = shortjs.getShortUrl(urlCode);
                        var resultShortUrl = shortUrl + '.theo';
                        console.log('urlCode', urlCode);
                        urlData = {
                            'originalLongUrl': longUrl,
                            'urlCode': urlCode,
                            'shortURL': resultShortUrl
                        };
                        //Enter 'urlData' with latest 'urlCode' sequence and shortenedUrl
                        //save() function returns a promise
                        var savePromise = dbops.enterNewUrlData(urlData);
                        return savePromise;
                    })
                    //On savePromise return of docs saved to db
                    .then(function(docs) {
                        response.status(200).json({
                            'originalURL': docs.originalLongUrl,
                            'urlCode': docs.urlCode,
                            'shortURL': docs.shortURL
                        });

                        dbops.incrementCounter()
                            .then(function(result) {
                                console.log("Success updated counters collection sequence field ", result);
                            });
                    });
            } else {
                console.log("Duplicate URL");
                response.status(200).json({
                    'error': 'Duplicate value, URL already exists in db',
                    'url': longUrl
                });
            }
        });
    } else {
        console.log("--Invalid URL format--");
        response.status(500).json({
            'error': 'Invalid URL format. URL must comply to http(s)://(www.)domain.ext(/)(path)',
            'url': longUrl
        });
    }
});

app.get('/:shortUrl', function(request, response) {
    request.on('error', function(error) {
        console.log("An error has occured", error);
    });
    response.on('error', function(error) {
        console.log("An error has occured", error);
    });
    var shortUrl = request.params.shortUrl;
    console.log("shortUrl: ", shortUrl);
    dbops.checkIfShortUrlExist(shortUrl).then(function(docs) {
        console.log("docs: ", docs);
        if (!docs) {
            response.status(404).json({ "error": "Incorrect short URL,please check the URL again" });
        } else {
            console.log("docs.originalLongUrl:", docs.originalLongUrl);
            response.redirect(docs.originalLongUrl);
        }
    });
});

//Validate format of input URL with RegEx pattern
function validateInputUrl(url) {
    var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])(\/[-A-Za-z0-9@:%._\+~#=?]*)*/g");
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
//what kind of operations are considered async
