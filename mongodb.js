//Importing mongodb and mongoose modules
var mongodb = require('mongodb');
var mongoose = require("mongoose");
var url = 'mongodb://localhost:27017/urlShortener';

//Using global promise since mongoose promise is deprecated
mongoose.Promise = global.Promise;
console.log("Mongoose stuff");

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
    shortCode: {
        type: Number,
        index: true
    }
});

//Models are constructors compiled from Schema definitions.
//Creating a model(object) for querying,creating and validating documents in 'UrlData' collection based on the specific schema(urlShortnerSchema).

var urlShortenerModel = dbconn.model('urldata', urlShortnerSchema);

//module.exports object contains those contents of the file that we want other files to use
module.exports = {
    enterNewUrlData: function(newUrlData) {
        console.log('Inside enterNewUrlData');
        //New instance of model to enter new document
        var newEntry = new urlShortenerModel(newUrlData);

        //Document entry into db
        /*newEntry.save(function(error) {
            if (error) {
                return console.log("An error has occured: ", error);
            } else {
                console.log("Entry saved to collection in db");
            }
        });*/

        var savePromise = newEntry.save();
        return savePromise;
    },

    checkDuplicateData: function(inputUrl) {
        //console.log("Inside checkDuplicateData");
        var isDuplicateUrl;
        var query = urlShortenerModel.find({ 'originalLongUrl': inputUrl });
        var queryPromise = query.exec();
        /*console.log('----After promise----- ');
        promise.then(function(doc) {
            console.log("Inside promise then()");
            isDuplicateUrl = true;
            if (doc.length == 0) {
                isDuplicateUrl = false;
            } else {
                isDuplicateUrl = true;
            }
            console.log("--isDuplicateUrl-- ", isDuplicateUrl);
        });
        return isDuplicateUrl;*/
        return queryPromise;
    },

    /*checkDuplicateData: function(inputUrl) {
        urlShortenerModel.find({
            'originalLongUrl': inputUrl
        }, function(error, docs) {
            if (error) {
                return console.log('An error has occured', error);
            } else {
                console.log("Queried docs ", docs);
                console.log("docs.length: ", docs.length);
                if (docs.length !== 0) {
                    var isDuplicate = true;
                    console.log("There is a duplicate url in the db");
                } else {
                    console.log('Valid url for entry to db');
                    var newUrlData = {
                        originalLongUrl: inputUrl,
                        shortCode: 0
                    };
                    var newEntry = new urlShortenerModel(newUrlData);
                    //Document entry into db
                    newEntry.save(function(error) {
                        if (error) {
                            return console.log("An error has occured: ", error);
                        } else {
                            console.log("Entry saved to collection in db");
                        }
                    });
                }
            }
        });
    }*/
};

//Model is used for querying,creating,retrieving documents.
//On enetring a document not following the Schema, a validation error will be thrown
