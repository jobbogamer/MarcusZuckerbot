// Automatically fetch images from URLs.

var http = require('http');
var https = require('https')

var fetchImage = function(matches, info, replyCallback) {
    // Facebook will sometimes fetch the image and attach it automatically.
    if (info.attachments && info.attachments.length > 0) {
        replyCallback(null);
        return;
    }

    // Loop over all the URLs that were found.
    matches.forEach(function(url) {
        // Use the correct http/https module based on the URL. Open the image
        // as a stream and attach it to a blank message.
        if (url.indexOf('https') !== -1) {
            https.get(url, function(res) {
                if (res.statusCode != 200) {
                    if (res.statusCode == 404) {
                        replyCallback({
                            body: "Looks like that image doesn't exist."
                        })
                    }
                    else {
                        replyCallback({
                            body: 'An error occurred when fetching the image. (' +
                                  res.statusCode + ')'
                        });
                        return;
                    }   
                }

                replyCallback({
                    body: '',
                    attachment: res
                });
            }).on('error', function(err) {
                replyCallback(null);
            });
        }
        else {
            http.get(url, function(res) {
                if (res.statusCode != 200) {
                    if (res.statusCode == 404) {
                        replyCallback({
                            body: "Looks like that image doesn't exist."
                        })
                    }
                    else {
                        replyCallback({
                            body: 'An error occurred when fetching the image. (' +
                                  res.statusCode + ')'
                        });
                        return;
                    }   
                }

                replyCallback({
                    body: '',
                    attachment: res
                });
            }).on('error', function(err) {
                replyCallback(null);
            });
        }
    });
}


module.exports = function init() {
    return {
        name: 'fetchImage',
        func: fetchImage,
        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,40}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*\.(jpg|jpeg|png|gif)[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    }
};
