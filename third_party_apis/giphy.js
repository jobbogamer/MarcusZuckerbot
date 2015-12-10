// Use the Giphy API to search for a GIF.

var Giphy = require('giphy')(process.env.GIPHY_API_KEY);


var translate = function(searchTerm, callback) {
    var encodedSearchTerm = searchTerm.replace(/\s/g, '+');

    var options = {
        s: encodedSearchTerm
    };

    Giphy.translate(options, function giphyCallback(err, data, res) {
        if (data.data != null && data.data.images != null) {
            callback(err, data.data.images.downsized.url);
        }
        else {
            callback(err, null);
        }
    });
}


module.exports = {
    translate: translate
};
