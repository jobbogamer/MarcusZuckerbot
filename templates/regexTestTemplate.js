
var init = require('../../regexCommands/COMMAND_NAME');
var should = require('should');


describe('COMMAND_NAME', function() {
    describe('match', function() {
        // Test that the regex only matches expected messages.
        var command = init();
        var regex = new RegExp(command.pattern);

        // ******** REGEX MATCH TESTS GO HERE ********

        it('should match foobar', function() {
            var matches = 'foobar'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should find all instances of foobar', function() {
            var matches = 'foobar baz foobar baz'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);
        });

        // *******************************************
    });


    describe('execute', function() {
        it('should do something', function(done) {
            var command = init();

            var matches = [];

            var info = {};

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // ******** REPLACE THIS WITH YOUR OWN TESTS ********
                var assertion = new should.Assertion('COMMAND_NAME');
                assertion.params = {
                    operator: 'to be implemented'
                };
                assertion.fail();
                // **************************************************

                done();
            });
        });
    });
});
