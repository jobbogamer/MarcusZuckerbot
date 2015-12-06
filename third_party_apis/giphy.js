// Use the Giphy API to search for a GIF.

var Giphy = require('giphy')(process.env.GIPHY_API_KEY);


var search = function(searchTerm, callback) {
    var encodedSearchTerm = searchTerm.replace(/\s/g, '+');

    var options = {
        tag: encodedSearchTerm
    };

    Giphy.random(options, function giphyCallback(err, data, res) {
        callback(err, data.data.image_url);
    });
}


module.exports = {
    search: search
};
