// Uses the Giphy API to send a random GIF matching a search term.

var giphy = require('../third_party_apis/giphy');
var http = require('http');


var sendGIF = function(options, replyCallback) {
    var searchTerm = options.arguments[0];
    giphy.search(searchTerm, function(err, url) {
        if (err) {
            replyCallback({
                body: 'An error occurred when searching for the GIF.'
            });
            return;
        }

        // To send a GIF as a message, it has to be sent as an attachment, which
        // means it has to be passed as a stream.
        http.get(url, function(res) {
            replyCallback({
                body: '',
                attachment: res
            });
        });        
    });
}

var usage = [
    {
        arguments: ['searchTerm'],
        description: 'Find a random GIF matching the search term.'
    }
];


module.exports = {
    name: 'sendGIF',
    func: sendGIF,
    usage: usage
};