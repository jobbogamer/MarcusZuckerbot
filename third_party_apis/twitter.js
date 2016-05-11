
var Twitter = require('twitter');


var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


var getTweet = function(tweetID, callback) {
    client.get('statuses/show', {id: tweetID}, function(error, tweet, response) {
        if (error) {
            callback(error, null);
        }
        else {
            // Build a new Tweet object with just the required properties.
            var newTweet = {
                username: tweet.user.screen_name,
                realName: tweet.user.name,
                images: [],
                quotedTweet: null
            }

            // Replace the t.co short links with expanded URLs. This needs to be done for
            // both regular URLs and media URLS.
            var replacements = []

            // Store URLs to the media so that images can be downloaded.
            var images = []

            // Find replacements for regular URLs.
            if (tweet.entities && tweet.entities.urls) {
                tweet.entities.urls.forEach(function(url) {
                    for (var i = 0; i < replacements.length; i++) {
                        if (replacements[i].start == url.indices[0]) {
                            return;
                        }
                    }

                    replacements.push({
                        start: url.indices[0],
                        end: url.indices[1],
                        text: url.expanded_url
                    });
                });
            }

            // Find replacements for media URLs.
            if (tweet.extended_entities && tweet.extended_entities.media) {
                tweet.extended_entities.media.forEach(function(media) {
                    // If it's a URL of a photo, that can be downloaded and
                    // sent with the tweet, so store the URL.
                    if (media.type == 'photo') {
                        images.push(media.media_url);
                    }

                    for (var i = 0; i < replacements.length; i++) {
                        if (replacements[i].start == media.indices[0]) {
                            return;
                        }
                    }

                    replacements.push({
                        start: media.indices[0],
                        end: media.indices[1],
                        text: media.display_url
                    });
                });
            }

            // Sort the replacements into reverse order by character position.
            // This is because replacing them in order would offset the
            // character positions and stop the replacements from working.
            replacements.sort(function(a, b) {
                return b.start - a.start;
            });

            // Make each replacement.
            var tweetText = tweet.text;
            replacements.forEach(function(replacement) {
                if (replacement) {
                    tweetText = tweetText.substring(0, replacement.start) + replacement.text + tweetText.substring(replacement.end);
                }
            });

            // Add the text with the replacements into the new tweet object.
            newTweet.text = tweetText;

            // Add the photo URLs.
            newTweet.images = images;

            // If the tweet quotes another tweet, store the ID of that tweet.
            if (tweet.quoted_status) {
                newTweet.quotedTweet = tweet.quoted_status_id_str;
            }

            // Return the newly constructed tweet object.
            callback(null, newTweet);
        }
    });
}


module.exports = {
    getTweet: getTweet
}
