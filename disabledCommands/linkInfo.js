// Describe your plugin here.

var readability = require('../third_party_apis/readability');
var dateformat = require('dateformat');
var Entities = require('html-entities').AllHtmlEntities;
var helpers = require('../helpers');


var entities = new Entities();


var linkInfo = function(matches, info, replyCallback) {
    /* Accept double-posts because linkInfo provides more information
       than facebook. If it gets too annoying, uncomment this section.
    // Facebook will sometimes fetch some information about URLs and attach
    // it automatically.
    if (info.attachments && info.attachments.length > 0) {
        replyCallback(null);
        return;
    }
    */
    
    // Loop over all the URLs that were found.
    matches.forEach(function(url) {
        // Get information about the link from the readability API.
        readability.getDetails(url, function(err, details) {
            if (err) {
                console.log('Error from readability:');
                console.log(err);

                var reply = "That page doesn't seem to exist.";
                var message = {
                    body: reply
                };

                replyCallback(message);

                return;
            }

            var authorString = '';
            if (details.author.length > 0) {
                authorString = 'By ' + entities.decode(details.author);
            }

            var dateString = '';
            try {
                var date = new Date(details.date);
                dateString = dateformat(date, 'dd mmm yyyy');

                if (authorString.length > 0) {
                    dateString = ' - ' + dateString;
                }
            }
            catch (err) {
                // Leave dateString empty
            }

            var byline = '';
            if (authorString.length > 0 || dateString.length > 0) {
                byline = authorString + dateString + '\n';
            }

            var wordCountString = '';
            if (authorString.length > 0) {
                // Only show a word count if there's an author name. This is
                // a bit of a hacky way to only show word counts on actual
                // articles.
                wordCountString = '~' + helpers.addThousandsSeparators(details.wordCount) + ' words';
            }            

            var reply = '' +
                        entities.decode(details.title) + '\n\n' +
                        entities.decode(details.excerpt) + '\n\n' +
                        byline +
                        wordCountString;

            var message = {
                body: reply
            };

            replyCallback(message);
        });
    });
}


module.exports = function init() {
    if (!process.env.READABILITY_API_KEY) {
        return {
            error: 'READABILITY_API_KEY environment variable is not set.'
        }
    }
    else {
            return {
            name: 'linkInfo',
            func: linkInfo,
            pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,40}\b(?!.*(?:\.jpe?g|\.gif|\.png))([-a-zA-Z0-9@:%_\+.~#?&//=]*[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        }
    }
};
