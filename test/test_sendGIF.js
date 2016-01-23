
var mockery = require('mockery');
var should = require('should');

process.env.GIPHY_API_KEY = 'abcdef123';

var init = require('../commands/sendGIF');
var command = init();


// Mock of giphy.js which always returns a valid URL.
var giphyMockWorks = {
    translate: function(searchTerm, callback) {
        callback(null, 'http://i.giphy.com/JIX9t2j0ZTN9S.gif');
    }
};

// Mock of giphy.js which doesn't return an error, but also doesn't return a
// result URL.
var giphyMockNoResults = {
    translate: function(searchTerm, callback) {
        callback(null, null);
    }
};

// Mock of giphy.js which always returns an error.
var giphyMockErrors = {
    translate: function(searchTerm, callback) {
        callback('Something went wrong.', null);
    }
};

// Mock of giphy.js which returns a valid URL which uses HTTPS.
var giphyMockHTTPS = {
    translate: function(searchTerm, callback) {
        callback(null, 'https://i.giphy.com/JIX9t2j0ZTN9S.gif')
    }
};


function useMock(mock) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.registerMock('../third_party_apis/giphy', mock);

    init = require('../commands/sendGIF');
    command = init();
}


describe('sendGIF', function() {
    before('enable Mockery', function() {
        mockery.enable({
            useCleanCache: true
        });
        mockery.warnOnUnregistered(false);
    });

    after('disable Mockery', function() {
        mockery.disable();
    });

    beforeEach('set API key', function() {
        process.env.GIPHY_API_KEY = 'abcdef123';
    });


    describe('init', function() {
        it('should return an error if no API key is set', function() {
            // Make sure the GIPHY_API_KEY variable is not set.
            if (process.env.GIPHY_API_KEY) {
                delete process.env.GIPHY_API_KEY;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });


        it('should return a valid command object when an API key is set', function() {
            command = init();

            // Check the name property is a non-empty string.
            command.should.have.property('name');
            command.name.should.be.String();
            command.name.should.not.be.length(0);
            command.name.should.be.eql('sendGIF');

            // Check the func property is actually a function.
            command.should.have.property('func');
            command.func.should.be.Function();

            // Check the usage property is an array.
            command.should.have.property('usage');
            command.usage.should.be.Array();

            // Check each element of the usage array to make sure each one
            // is an object containing an array of arguments and a string
            // description.
            for (var i = 0; i < command.usage.length; i++) {
                var usage = command.usage[i];
                usage.should.be.Object();

                // Check the usage has an array of arguments.
                usage.should.have.property('arguments');
                usage.arguments.should.be.Array();

                // Check that each element of the arguments array is a
                // non-empty string.
                for (var j = 0; j < command.usage[i].arguments.length; j++) {
                    var argument = usage.arguments[j];
                    argument.should.be.String();
                    argument.should.not.be.length(0);
                }

                // Check the description is a non-empty string.
                usage.should.have.property('description');
                command.usage[i].description.should.be.String();
                command.usage[i].description.should.not.be.length(0);
            }
        });
    });


    describe('execute', function() {
        // Allow longer than usual for the tests because they access the web.
        this.timeout(10000);
        this.slow(5000);

        it('should return an attachment when finding a GIF', function(done) {
            useMock(giphyMockWorks);

            var arguments = {
                searchTerm: 'cat'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                // The reply should have an empty body but contain an attachment.
                reply.should.be.Object();

                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.have.length(0);

                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();

                done();
            });
        });


        it('should return a message when no GIF is found', function(done) {
            useMock(giphyMockNoResults);

            var arguments = {
                searchTerm: 'notfound'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                // The reply should have a body and no attachment.
                reply.should.be.Object();

                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.not.have.length(0);

                reply.should.not.have.property('attachment');

                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            useMock(giphyMockErrors);

            var arguments = {
                searchTerm: 'error'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                // The reply should have a body and no attachment.
                reply.should.be.Object();

                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should mention that an error occurred.
                reply.body.should.match(/error/gi);

                reply.should.not.have.property('attachment');

                done();
            });
        });


        it('should cope with HTTPS result URLs', function(done) {
            useMock(giphyMockHTTPS);

            var arguments = {
                searchTerm: 'cat'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                // The reply should have an empty body but contain an attachment.
                reply.should.be.Object();

                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.have.length(0);

                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();

                done();
            });
        });
    });
});
