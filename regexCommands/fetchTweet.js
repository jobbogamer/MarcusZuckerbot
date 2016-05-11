// Fetch tweet text and images from their URLs.

var twitter = require('../third_party_apis/twitter');
var http = require('http');
var https = require('https');


function sendImage(url, replyCallback) {
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
        replyCallback({
            body: 'An error occurred when fetching the image.'
        });
    });
}


function fetchAndSend(tweetID, quoted, replyCallback) {
    // Get the tweet using the twitter API.
    var tweet = twitter.getTweet(tweetID, function twitterCallback(err, tweet) {
        if (err || !tweet) {
            console.log(err);
            reply = 'An error occurred when fetching the tweet.';

            var message = {
                body: reply
            };

            replyCallback(message);
            return;
        }

        // Build the reply.
        reply = tweet.text + '\n' + '– @' + tweet.username + ' (' + tweet.realName + ')';

        // If this is a quoted tweet, mark it as such.
        if (quoted) {
            reply = 'Quoted tweet:\n' + reply;
        }

        var message = {
            body: reply
        };

        replyCallback(message);

        // If the tweet has images attached, send each one of them.
        tweet.images.forEach(function(url) {
            sendImage(url, replyCallback);
        });

        // If the tweet quotes another tweet, send the quoted tweet, but only
        // if this is not already a quoted tweet (to avoid infinite chains).
        if (!quoted && tweet.quotedTweet && tweet.quotedTweet.length > 0) {
            fetchAndSend(tweet.quotedTweet, true, replyCallback);
        }
    });
}


var fetchTweet = function(matches, info, replyCallback) {
    // Loop through each tweet URL that was matched.
    matches.forEach(function(match) {
        // Regex captures tweet ID into group 1.
        var tweetID = match[1];

        // Fetch the tweet and send the message.
        fetchAndSend(tweetID, false, replyCallback);        
    });
}


module.exports = function init() {
    var error = '';
    
    if (!process.env.TWITTER_CONSUMER_KEY) {
        error = 'TWITTER_CONSUMER_KEY environment variable is not set.';
    }
    else if (!process.env.TWITTER_CONSUMER_SECRET) {
        error = 'TWITTER_CONSUMER_SECRET environment variable is not set.';
    }
    else if (!process.env.TWITTER_ACCESS_TOKEN_KEY) {
        error = 'TWITER_ACCESS_TOKEN_KEY environment variable is not set.';
    }
    else if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) {
        error = 'TWITTER_ACCESS_TOKEN_SECRET environment variable is not set.';
    }

    if (error.length > 0) {
        return {
            error: error
        }
    }
    else {
        return {
            name: 'fetchTweet',
            func: fetchTweet,
            pattern: /https?:\/\/twitter\.com\/\w{1,15}\/status\/(\d+)/gi
        }
    }
};
