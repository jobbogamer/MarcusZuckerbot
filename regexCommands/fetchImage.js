// Automatically fetch images from URLs.

var http = require('http');
var https = require('https')

var fetchImage = function(matches, info, replyCallback) {
    // Facebook will sometimes fetch the image and attach it automatically.
    // However, if there are fewer attachments than URLs, attach the ones
    // at the end of the list of matches. (From experimentation, it seems
    // only one will be sent, and it will always be the first one.)
    var imagesToSkip = 0;
    if (info.attachments) {
        imagesToSkip = info.attachments.length;
    }

    // If all images are skipped, send no reply.
    if (imagesToSkip >= matches.length) {
        replyCallback(null);
        return;
    }

    for (var i = imagesToSkip; i < matches.length; i++) {
        var url = matches[i];

        // Use the correct http/https module based on the URL.
        var protocol = (url.indexOf('https') !== -1) ? https : http;

        // Open the image as a stream and attach it to a blank message.
        protocol.get(url, function(res) {
            if (res.statusCode != 200) {
                if (res.statusCode == 404) {
                    replyCallback({
                        body: "Looks like that image doesn't exist."
                    });
                }
                else {
                    replyCallback({
                        body: 'An error occurred when fetching the image. (' +
                              res.statusCode + ')'
                    });
                }
                return;
            }

            replyCallback({
                body: '',
                attachment: res
            });
        }).on('error', function(err) {
            replyCallback(null);
        });
    }
}


module.exports = function init() {
    return {
        name: 'fetchImage',
        func: fetchImage,
        pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,40}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*\.(jpg|jpeg|png|gif)[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    }
};
