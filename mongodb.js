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
    urlCode: {
        type: Number,
        index: true
    }
});

//Counters collection keeps track of the latest count_sequences of different fields
//Schema for counters collection
var countersCollectionSchema = mongoose.Schema({
    "_id": String,
    "sequence_value": Number
});

//Models are constructors compiled from Schema definitions.
//Creating a model(object) for querying,creating and validating documents in 'UrlData' collection based on the specific schema(urlShortnerSchema).
var urlShortenerModel = dbconn.model('urldata', urlShortnerSchema);
//Model for counter collection
var countersCollectionModel = dbconn.model('counter', countersCollectionSchema);

//One time insert counter collection with - sequence_value": 1000
var counterData = {
    "_id": "urlCode",
    "sequence_value": 1000
};
var counterEntry = new countersCollectionModel(counterData);
var counterPromise = counterEntry.save();
countersCollectionModel.find({ "sequence_value": 1000 }, function(error, docs) {
    if (error) {
        console.log("An error occured", error);
    } else {
        if (docs.length === 0) {
            counterPromise.then(function(docs) {
                console.log("Initial counter doc " + docs + " saved to db");
            });
        }
    }
});

//module.exports object contains those contents of the file that we want other files to use
module.exports = {

    getNextUrlCodeSequence: function(sequenceName) {
        console.log('Inside getNextUrlCodeSequence');

        var counterPromise = countersCollectionModel.find({ _id: sequenceName }).exec();
        /*counterPromise.then(function(sequence_doc) {
                console.log("docs", sequence_doc);
                return sequence_doc;
            })
            .then(function(sequence_doc) {
                console.log('sequence_doc.sequence_value', sequence_doc.sequence_value);
                sequence_doc.sequence_value = sequence_doc.sequence_value + 1;
                urlCode = sequence_doc.sequence_value;
                return sequence_doc.save();
            })
            .then(function(docs) {
                console.log("The doc " + docs + " is saved");
                return urlCode;
            });*/
        console.log("Hello Dolly 0 !!");
        return counterPromise;
    },

    incrementCounter: function() {
        var conterUpdatePromise = countersCollectionModel.update({ "_id": "urlCode" }, { $inc: { sequence_value: 1 } }).exec();
        console.log("-------", conterUpdatePromise instanceof Promise);
        return conterUpdatePromise;
    },

    enterNewUrlData: function(newUrlData) {
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

        //mongoose save() function returns promise
        var savePromise = newEntry.save();
        return savePromise;
    },

    checkDuplicateData: function(inputUrl) {
        //console.log("Inside checkDuplicateData");
        var isDuplicateUrl;
        var query = urlShortenerModel.find({ 'originalLongUrl': inputUrl });
        var queryPromise = query.exec();

        /*promise.then(function(doc) {
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
                        urlCode: 0
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
