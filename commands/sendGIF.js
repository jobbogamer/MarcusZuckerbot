// Uses the Giphy API to send a random GIF matching a search term.
// Requires GIPHY_API_KEY to be set in the environment variables.

var giphy = require('../third_party_apis/giphy');
var http = require('http');
var https = require('https');


var sendGIF = function(arguments, info, replyCallback) {
    giphy.translate(arguments.searchTerm, function(err, url) {
        if (err) {
            replyCallback({
                body: 'An error occurred when searching for the GIF.'
            });
            return;
        }

        if (url) {
            // Use the correct http/https module based on the URL.
            if (url.indexOf('https') !== -1) {
                https.get(url, function(res) {
                    replyCallback({
                        body: '',
                        attachment: res
                    });
                });
            }
            else {
                http.get(url, function(res) {
                    replyCallback({
                        body: '',
                        attachment: res
                    });
                });
            }
        }
        else {
            replyCallback({
                body: 'No matching GIFs found.'
            });
        }
    });
}

var usage = [
    {
        arguments: ['searchTerm'],
        description: 'Find a random GIF matching the search term.'
    }
];


module.exports = function init() {
    if (!process.env.GIPHY_API_KEY) {
        return {
            error: 'GIPHY_API_KEY environment variable is not set.'
        };
    }

    return {
        name: 'sendGIF',
        func: sendGIF,
        usage: usage
    };
}
