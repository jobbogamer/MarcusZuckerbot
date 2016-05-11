
var init = require('../../regexCommands/fetchTweet');
var should = require('should');
var mockery = require('mockery');

var command = null;
var regex = null;

// Mock of twitter.js which always returns a valid tweet.
var twitterMockWorks = {
    getTweet: function(tweetID, callback) {
        var tweet = {
            text: 'This is a tweet',
            username: 'some_user',
            realName: 'Some User',
            images: [],
            quotedTweet: null
        };
        callback(null, tweet);
    }
};

// Mock of twitter.js which doesn't return an error, but also doesn't return a
// tweet.
var twitterMockNoResults = {
    getTweet: function(tweetID, callback) {
        callback(null, null);
    }
};

// Mock of twitter.js which always returns an error.
var twitterMockErrors = {
    getTweet: function(tweetID, callback) {
        callback('Something went wrong.', null);
    }
};

// Mock of twitter.js which returns a valid tweet which has an image.
var twitterMockImage = {
    getTweet: function(tweetID, callback) {
        var tweet = {
            text: 'This is a tweet',
            username: 'some_user',
            realName: 'Some User',
            images: ['https://i.giphy.com/JIX9t2j0ZTN9S.gif'],
            quotedTweet: null
        };
        callback(null, tweet);
    }
};

// Mock of twitter.js which returns a valid tweet which has multiple images.
var twitterMockMultipleImages = {
    getTweet: function(tweetID, callback) {
        var tweet = {
            text: 'This is a tweet',
            username: 'some_user',
            realName: 'Some User',
            images: ['https://i.giphy.com/JIX9t2j0ZTN9S.gif', 'http://i.giphy.com/freTElrZl4zaU.gif'],
            quotedTweet: null
        };
        callback(null, tweet);
    }
};

// Mock of twitter.js which returns a valid tweet which quotes another tweet.
var twitterMockQuote = {
    getTweet: function(tweetID, callback) {
        if (tweetID !== 'quoted_tweet') {
            var tweet = {
                text: 'This is a tweet',
                username: 'some_user',
                realName: 'Some User',
                images: [],
                quotedTweet: 'quoted_tweet'
            };
        }
        else {
            var tweet = {
                text: 'This is another tweet',
                username: 'some_other_user',
                realName: 'Some Other User',
                images: [],
                quotedTweet: null
            };
        }

        callback(null, tweet);
    }
};

// Mock of twitter.js which returns a valid tweet which quotes another tweet
// with an image.
var twitterMockQuoteWithImage = {
    getTweet: function(tweetID, callback) {
        if (tweetID !== 'quoted_tweet') {
            var tweet = {
                text: 'This is a tweet',
                username: 'some_user',
                realName: 'Some User',
                images: [],
                quotedTweet: 'quoted_tweet'
            };
        }
        else {
            var tweet = {
                text: 'This is another tweet',
                username: 'some_other_user',
                realName: 'Some Other User',
                images: ['https://i.giphy.com/JIX9t2j0ZTN9S.gif'],
                quotedTweet: null
            };
        }

        callback(null, tweet);
    }
};


function useMock(mock) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.registerMock('../third_party_apis/twitter', mock);

    init = require('../../regexCommands/fetchTweet');
    command = init();
}


describe('fetchTweet', function() {
    before('enable Mockery', function() {
        mockery.enable({
            useCleanCache: true
        });
        mockery.warnOnUnregistered(false);
    });

    after('disable Mockery', function() {
        mockery.disable();
    });

    beforeEach('set environment variables', function() {
        // Set any string as the keys and secrets. It doesn't matter
        // what is used since the twitter module is being mocked anyway.
        process.env.TWITTER_CONSUMER_KEY = 'abc123';
        process.env.TWITTER_CONSUMER_SECRET = 'def456';
        process.env.TWITTER_ACCESS_TOKEN_KEY = 'xzy789';
        process.env.TWITTER_ACCESS_TOKEN_SECRET = 'password1234';
    });


    describe('init', function() {
        it('should return an error if no consumer key is set', function() {
            init.should.be.Function();

            // Make sure the TWITTER_CONSUMER_KEY variable is not set.
            if (process.env.TWITTER_CONSUMER_KEY) {
                delete process.env.TWITTER_CONSUMER_KEY;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return an error if no consumer secret is set', function() {
            init.should.be.Function();

            // Make sure the TWITTER_CONSUMER_SECRET variable is not set.
            if (process.env.TWITTER_CONSUMER_SECRET) {
                delete process.env.TWITTER_CONSUMER_SECRET;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return an error if no access token key is set', function() {
            init.should.be.Function();

            // Make sure the TWITTER_ACCESS_TOKEN variable is not set.
            if (process.env.TWITTER_ACCESS_TOKEN_KEY) {
                delete process.env.TWITTER_ACCESS_TOKEN_KEY;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return an error if no access token secret is set', function() {
            init.should.be.Function();

            // Make sure the TWITTER_ACCESS_TOKEN_SECRET variable is not set.
            if (process.env.TWITTER_ACCESS_TOKEN_SECRET) {
                delete process.env.TWITTER_ACCESS_TOKEN_SECRET;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return a valid command object when auth is set', function() {
            init.should.be.Function();

            // Set any string as the keys and secrets. It doesn't matter
            // what is used.
            process.env.TWITTER_CONSUMER_KEY = 'abc123';
            process.env.TWITTER_CONSUMER_SECRET = 'def456';
            process.env.TWITTER_ACCESS_TOKEN_KEY = 'xzy789';
            process.env.TWITTER_ACCESS_TOKEN_SECRET = 'password1234';

            command = init();

            // Check the name property is a non-empty string.
            command.should.have.property('name');
            command.name.should.be.String();
            command.name.should.not.be.length(0);
            command.name.should.be.eql('fetchTweet');

            // Check the func property is actually a function.
            command.should.have.property('func');
            command.func.should.be.Function();

            // Check the pattern property is a regex.
            command.should.have.property('pattern');
            if (!(command.pattern instanceof RegExp)) {
                var assertion = new should.Assertion(command.pattern);
                assertion.params = {
                    operator: 'to be a RegExp object'
                };
                assertion.fail()
            }

            // Perform a basic sanity check on the pattern string to check
            // that it resembles a valid regular expression.
            try {
                var regex = new RegExp(command.pattern);
            }
            catch (err) {
                var assertion = new should.Assertion(command.pattern);
                assertion.params = {
                    operator: 'to be a valid regex'
                };
                assertion.fail()
            }
        });
    });


    describe('match', function() {
        // Test that the regex only matches expected messages.
        beforeEach('create regex', function() {
            command = init();
            regex = new RegExp(command.pattern);
        });

        // ******** REGEX MATCH TESTS GO HERE ********

        it('should match tweet URLs', function() {
            var matches = 'http://twitter.com/jobbogamer/status/722049762120351700'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match HTTPS tweet URLs', function() {
            var matches = 'https://twitter.com/jobbogamer/status/722049762120351700'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match multiple tweet URLs', function() {
            var matches = 'https://twitter.com/jobbogamer/status/722049762120351700 and https://twitter.com/jobbogamer/status/717018891377975300'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);
        });


        it('should not match incomplete URLs', function() {
            var matches = 'https://twitter.com/jobbogamer/'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://twitter.com/jobbogamer/status'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://twitter.com/status/722049762120351700'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://twitter.com/722049762120351700'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });

        // *******************************************
    });


    describe('execute', function() {
        // Allow longer than usual for the tests because they access the web.
        this.timeout(10000);
        this.slow(5000);

        it('should fetch a tweet', function(done) {
            useMock(twitterMockWorks);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // Reply should contain the tweet text...
                reply.body.should.match(/This is a tweet/gi);

                // ...and the username...
                reply.body.should.match(/some_user/gi);

                // ...and the user's real name.
                reply.body.should.match(/Some User/gi);

                done();
            });
        });


        it('should fetch a tweet with an image', function(done) {
            useMock(twitterMockImage);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            var receivedText = false;
            var receivedImage = false;

            command.func(matches, {}, function replyCallback(reply, chat) {
                // The first reply should contain the tweet text.
                if (!receivedText) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is a tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some User/gi);

                    receivedText = true;
                }
                // The subsequent reply should contain the image attachment.
                else {
                    reply.should.be.Object();
                    reply.should.have.property('attachment');
                    reply.attachment.should.be.Object();

                    receivedImage = true;
                }

                if (receivedText && receivedImage) {
                    done();
                }
            });
        });


        it('should fetch a tweet with multiple images', function(done) {
            useMock(twitterMockMultipleImages);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            var receivedText = false;
            var receivedImages = 0;

            command.func(matches, {}, function replyCallback(reply, chat) {
                // The first reply should contain the tweet text.
                if (!receivedText) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is a tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some User/gi);

                    receivedText = true;
                }
                // The subsequent replies should contain an image attachment.
                else {
                    reply.should.be.Object();
                    reply.should.have.property('attachment');
                    reply.attachment.should.be.Object();

                    receivedImages++;
                }

                if (receivedText && receivedImages == 2) {
                    done();
                }
            });
        });


        it('should fetch a tweet and a quoted tweet', function(done) {
            useMock(twitterMockQuote);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            var receivedOriginal = false;
            var receivedQuoted = false;

            command.func(matches, {}, function replyCallback(reply, chat) {
                // The first reply should contain the original tweet.
                if (!receivedOriginal) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is a tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some User/gi);

                    receivedOriginal = true;
                }
                // The subsequent reply should contain the quoted tweet.
                else {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is another tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_other_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some Other User/gi);

                    receivedQuoted = true;
                }

                if (receivedOriginal && receivedQuoted) {
                    done();
                }
            });
        });


        it('should fetch a tweet and an image in a quoted tweet', function(done) {
            useMock(twitterMockQuoteWithImage);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            var receivedOriginal = false;
            var receivedQuoted = false;
            var receivedImage = false;

            command.func(matches, {}, function replyCallback(reply, chat) {
                // The first reply should contain the original tweet.
                if (!receivedOriginal) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is a tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some User/gi);

                    receivedOriginal = true;
                }
                // The subsequent reply should contain the quoted tweet.
                else if (!receivedQuoted) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // Reply should contain the tweet text...
                    reply.body.should.match(/This is another tweet/gi);

                    // ...and the username...
                    reply.body.should.match(/some_other_user/gi);

                    // ...and the user's real name.
                    reply.body.should.match(/Some Other User/gi);

                    receivedQuoted = true;
                }
                // The final reply should contain the image as an attachment.
                else {
                    reply.should.be.Object();
                    reply.should.have.property('attachment');
                    reply.attachmen.should.be.Object();

                    receivedImage = true;
                }

                if (receivedOriginal && receivedQuoted && receivedImage) {
                    done();
                }
            });
        });


        it('should handle errors gracefully', function(done) {
            useMock(twitterMockErrors);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // Reply should not contain the tweet text...
                reply.body.should.not.match(/This is a tweet/gi);

                // ...or the username...
                reply.body.should.not.match(/some_user/gi);

                // ...or the user's real name.
                reply.body.should.not.match(/Some User/gi);

                // Instead, it should say that an error occurred.
                reply.body.should.match(/error/gi);

                done();
            });
        });


        it('should handle null objects gracefully', function(done) {
            useMock(twitterMockNoResults);

            var matches = [
                ['http://twitter.com/some_user/status/1234567890', '1234567890']
            ];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // Reply should not contain the tweet text...
                reply.body.should.not.match(/This is a tweet/gi);

                // ...or the username...
                reply.body.should.not.match(/some_user/gi);

                // ...or the user's real name.
                reply.body.should.not.match(/Some User/gi);

                // Instead, it should say that an error occurred.
                reply.body.should.match(/error/gi);

                done();
            });
        });
    });
});
