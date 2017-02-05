var alphabet = "abcdefghijklmnopqrstuvwxyz-0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var base = alphabet.length;
console.log("base: ", base);
var shortUrl = [];
module.exports = {
		//Genearte shortened URL using base 10 to base64 conversion
    getShortUrl: function(inputUrlCode) {
        while (inputUrlCode > 0) {
            var quotient = Math.floor(inputUrlCode / base);
            var remainder = Math.floor(inputUrlCode % base);
            inputUrlCode = quotient;
            shortUrl.push(remainder);
        }
        console.log("shortUrl: ", shortUrl);
        //console.log("reversed shortUrl: ", shortUrl.reverse());
        //console.log("shortUrl: ", shortUrl);
        var convertedBase = shortUrl.reverse();
        console.log("convertedBase", convertedBase);
        var resultArray = [];
        for (i = 0; i < convertedBase.length; i++) {
            resultArray[i] = alphabet[convertedBase[i]];
        }
        console.log("resultArray: ", resultArray.toString());
        var shortenedUrl = resultArray.toString().replace(/\,/g, "");
        console.log("Converted base shortened url:", shortenedUrl);
        //shortUrl = [];
        //console.log("shortUrl = []: ", shortUrl = []);
        return shortenedUrl;
    }
};

//what if earth is that heaven everybody is sent for good deeds in past lives

