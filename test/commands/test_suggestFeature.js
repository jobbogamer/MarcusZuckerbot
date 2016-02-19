
var mockery = require('mockery');


describe('suggestFeature', function() {
    describe('init', function() {
        it('should return an error if no username is set', function() {
            var init = require('../../commands/suggestFeature');
            init.should.be.Function();

            // Make sure the GITHUB_USER variable is not set.
            if (process.env.GITHUB_USER) {
                delete process.env.GITHUB_USER;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return an error if no password is set', function() {
            var init = require('../../commands/suggestFeature');
            init.should.be.Function();

            // Make sure the GITHUB_PASSWORD variable is not set.
            if (process.env.GITHUB_PASSWORD) {
                delete process.env.GITHUB_PASSWORD;
            }

            // Set any value for the username.
            process.env.GITHUB_USER = 'user123';

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return a valid command object when auth is set', function() {
            var init = require('../../commands/suggestFeature');
            init.should.be.Function();

            // Set any string as the username and password. It doesn't matter
            // what is used.
            process.env.GITHUB_USER = 'user123';
            process.env.GITHUB_PASSWORD = 'password1234';

            var command = init();

            // Check the name property is a non-empty string.
            command.should.have.property('name');
            command.name.should.be.String();
            command.name.should.not.be.length(0);
            command.name.should.be.eql('suggestFeature');

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
        before(function() {
            mockery.enable({ useCleanCache: true });
            mockery.warnOnUnregistered(false);

            var githubMock = {
                createIssue: function(title, body, labels, callback) {
                    if (title === 'error') {
                        callback({
                            result: 404,
                            error: 'Page not found'
                        }, null);
                    }
                    else {
                        callback(null, {
                            title: title,
                            number: 42
                        });
                    }
                }
            };

            mockery.registerMock('../third_party_apis/githubIssues', githubMock);
        });

        after(function() {
            mockery.disable();
        });


        it('should display confirmation if creating the issue succeeds', function(done) {
            var init = require('../../commands/suggestFeature');
            var command = init();

            var arguments = {
                name: 'mySuggestion',
                description: 'Do something.'
            };

            var info = {};

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');

                // The message should contain the title of the issue, and the
                // GitHub issue number.
                reply.body.should.be.String();
                reply.body.should.match(/mySuggestion/g);
                reply.body.should.match(/42/g);

                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            var init = require('../../commands/suggestFeature');
            var command = init();

            var arguments = {
                name: 'error',
                description: 'Do something.'
            };

            var info = {};

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');

                // The message should say that an error occurred.
                reply.body.should.be.String();
                reply.body.should.match(/error/g);

                done();
            });
        });
    });
});
