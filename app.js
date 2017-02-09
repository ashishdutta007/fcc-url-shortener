//Importing mongodb and mongoose modules
var mongodb = require('mongodb');
var mongoose = require("mongoose");
var url = 'mongodb://localhost:27017/urlShortener';
//Using express module 
var express = require("express");
//Express server instance
var app = express();
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

//Making mongodb connection from mongoose ODM
var dbconn = mongoose.connect(url, function(error) {
    if (error) {
        return console.log("Error while trying to connect to mongodb ", error);
    } else {
        console.log("Connection made to mongo db on local");
    }
});
//Create a schema(object) -- a predefined structure/format for the documents in the 'urlshortener' collection.
//Schema are the blueprint(class) for the documents in the collection.
var urlShortnerSchema = mongoose.Schema({
    originalLongUrl: String,
    urlCode: {
        type: Number,
        index: true
    }
});
//Models are constructors compiled from Schema definitions.
//Different documents are instances of Model.All documents creation and retrieval from database are handled by models.
//Creating a model(object) for querying,creating and validating documents in 'UrlData' collection based on the specific schema(urlShortnerSchema).
var urlShortenerModel = dbconn.model('urldata', urlShortnerSchema);

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
        //console.log("isDuplicateUrl(longUrl): ", checkDuplicateData(longUrl));
        isDuplicateUrl(longUrl).then(function(doc) {
            var isDuplicateUrl;
            if (doc.length === 0) {
                isDuplicateUrl = false;
            } else {
                isDuplicateUrl = true;
            }
            console.log("--isDuplicateUrl-- ", isDuplicateUrl);
        });
    } else {
        return console.log("Invalid url format");
    }
});

//Validate format of input url
function validateInputUrl(url) {
    var pattern = new RegExp("/(https?:\/\/)?(www\.)([-A-Za-z0-9@:%._\+~#=?]+)([a-z])([\/-A-Za-z0-9@:%._\+~#=?]*)*/");
    var result = pattern.test(url);
    console.log('isValidUrl ?: ', result);
    return result;
}

//Validate if url is a duplicate value
function isDuplicateUrl(url) {
    console.log('Inside isDuplicateUrl');
    return checkDuplicateData(url);
}

function checkDuplicateData(inputUrl) {
    console.log("Inside checkDuplicateData");
    //var isDuplicateUrl;
    var query = urlShortenerModel.find({ 'originalLongUrl': inputUrl });
    var promise = query.exec();
    return promise;
}

//Express server instance listening on specific port
app.listen(port, function() {
    console.log("Server listening on port ", port);
});
