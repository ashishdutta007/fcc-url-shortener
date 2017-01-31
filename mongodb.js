//Importing mongodb and mongoose modules
var mongodb = require('mongodb');
var mongoose = require("mongoose");
var url = 'mongodb://localhost:27017/urlShortener';

//Making mongodb connection from mongoose ODM
var dbconn = mongoose.connect(url, function(error) {
	if (error) {
		return console.log("Error while trying to connect to mongodb ", error);
	}
	else {
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
//Different documents are instances of Model.All documents creation and retrieval from database are handled by models.
//Creating a model(object) for querying,creating and validating documents in 'UrlData' collection based on the specific schema(urlShortnerSchema).

var urlShortenerModel = dbconn.model('urldata', urlShortnerSchema);

//module.exports object contains those contents of the file that we want other files to use
module.exports = {
	enterNewUrlData: function(newUrlData) {

		/*var newEntry = new urlShortenerModel({
			originalLongUrl: 'test------www.google.com-------test',
			shortCode: 0
		});*/

		//New instance of model to enter new document
		var newEntry = new urlShortenerModel(newUrlData);

		//Document entry into db
		newEntry.save(function(error) {
			if (error) {
				return console.log("An error has occured: ", error);
			}
			else {
				console.log("Entry saved to collection in db");
			}
		});
	},

	checkDuplicateData: function(inputUrl) {
		urlShortenerModel.find({
			'originalLongUrl': inputUrl
		}, function(error, docs) {
			if (error) {
				return console.log('An error has occured', error);
			}
			else {
				console.log("docs.length: ", docs.length);
				var isDuplicate = true;
				if (docs.length != 0) {
					isDuplicate = true;
				}
				else{
					isDuplicate = false;
				}
				return isDuplicate;
				console.log("Queried docs ", docs);
			}
		});
	}
};
//On enetring a document not following the Schema, a validation error will be thrown
