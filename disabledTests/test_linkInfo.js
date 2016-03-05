
var init = require('../../regexCommands/linkInfo');
var should = require('should');
var mockery = require('mockery');


process.env.READABILITY_API_KEY = 'abcdef123';


var mockData = {
    title: 'Some Page',
    excerpt: 'Description of the page',
    author: 'A Writer',
    date: '2016-02-19 00:00:00',
    wordCount: 42,
    confidence: 0.5
};


// Mock of readability.js which always returns valid data.
var readabilityMockWorks = {
    getDetails: function(url, callback) {
        callback(null, mockData);
    }
};

// Mock of readability.js which returns a details object where the
// author and date fields are blank.
var readabilityMockMissingData = {
    getDetails: function(url, callback) {
        callback(null, {
            title: mockData.title,
            excerpt: mockData.excerpt,
            author: '',
            date: '',
            wordCount: mockData.wordCount,
            confidence: mockData.confidence
        });
    }
};

// Mock of readability.js which always returns an error.
var readabilityMockErrors = {
    getDetails: function(url, callback) {
        callback('Something went wrong.', null);
    }
};


function useMock(mock) {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.registerMock('../third_party_apis/readability', mock);

    init = require('../../regexCommands/linkInfo');
    command = init();
}


describe('linkInfo', function() {
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
        process.env.READABILITY_API_KEY = 'abcdef123';
    });


    describe('init', function() {
        it('should return an error if no API key is set', function() {
            // Make sure the READABILITY_API_KEY variable is not set.
            if (process.env.READABILITY_API_KEY) {
                delete process.env.READABILITY_API_KEY;
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
            command.name.should.be.eql('linkInfo');

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
        var command = init();
        var regex = new RegExp(command.pattern);


        it('should match basic URLs', function() {
            var matches = null;

            // www
            matches = 'http://www.google.com'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // No www
            matches = 'http://google.com'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Double TLD
            matches = 'http://google.co.uk'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Trailing slash
            matches = 'http://google.com/'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Path
            matches = 'http://www.google.com/search'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Path with trailing slash
            matches = 'http://www.google.com/search/images/'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match https URLs', function() {
            var matches = null;

            // www
            matches = 'https://www.google.com'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // No www
            matches = 'https://google.com'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Double TLD
            matches = 'https://google.co.uk'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Trailing slash
            matches = 'https://google.com/'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Path
            matches = 'https://www.google.com/search'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            // Path with trailing slash
            matches = 'https://www.google.com/search/images/'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match URLs with query parameters', function() {
            var matches = null;

            matches = 'http://www.google.com/?query=sausage'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://www.google.com/search?size=10'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://www.google.com/search?query=sausage&type=images'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://www.google.com/search/?query_string=sausage'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match URLs with weird TLDs', function() {
            var matches = null;

            matches = 'http://images.photography'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://concrete.builders/'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://fluffy.dog/photo?size=500'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


         it('should match messages with URLs and text', function() {
            var matches = null;

            matches = 'Look at this cool photo: http://imgur.com/abcdef'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/xyz123 is really good'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'Do you think http://imgur.com/q_r_s_t is appropriate?'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match multiple URLs in the same message', function() {
            var matches = null;

            var matches = 'http://imgur.com/abcdef http://imgur.com/xyz123'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);

            matches = 'Is http://imgur.com/xyz123 or http://imgur.com/q_r_s_t better?'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);
        });


        it('should match URLs that look sort of like image URLs', function() {
            matches = 'https://cake.gif/photo?size=500'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should not match image URLs', function() {
            var matches = null;

            matches = 'http://imgur.com/abcdef.jpg'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://imgur.com/q_r_s_t.gif'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://www.imgur.com/abcdef.jpeg?reverse=1'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://images.photography/1.jpg'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });


        it('should not match messages with no URL', function() {
            var matches = null;

            matches = 'This is a message that has no URL'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http:not.a.url.com/images/jpg'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });

    });


    describe('execute', function() {
        it('should display info about a link', function(done) {
            useMock(readabilityMockWorks);

            var matches = [['http://google.com']];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                reply.body.should.match(new RegExp(mockData.title));
                reply.body.should.match(new RegExp(mockData.excerpt));
                reply.body.should.match(/By/gi);
                reply.body.should.match(new RegExp(mockData.author));
                reply.body.should.match(new RegExp(mockData.wordCount));
                reply.body.should.match(/words/gi);
                reply.body.should.match(/19 Feb 2016/);

                done();
            });
        });


        it('should display info about a link when data is missing', function(done) {
            useMock(readabilityMockMissingData);

            var matches = [['http://google.com']];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                reply.body.should.match(new RegExp(mockData.title));
                reply.body.should.match(new RegExp(mockData.excerpt));
                reply.body.should.not.match(/By/gi);
                reply.body.should.not.match(new RegExp(mockData.author));
                
                // Don't show word count because there's no author name.
                reply.body.should.not.match(new RegExp(mockData.wordCount));
                reply.body.should.not.match(/words/gi);

                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            useMock(readabilityMockErrors);

            var matches = [['http://google.com']];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.not.have.length(0);

                reply.body.should.not.match(new RegExp(mockData.title));
                reply.body.should.not.match(new RegExp(mockData.excerpt));
                reply.body.should.not.match(/By/gi);
                reply.body.should.not.match(new RegExp(mockData.author));
                reply.body.should.not.match(new RegExp(mockData.wordCount));
                reply.body.should.not.match(/words/gi);
                reply.body.should.not.match(/19 Feb 2016/gi);

                done();
            });
        });
    });
});
