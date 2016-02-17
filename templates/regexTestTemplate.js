
var init = require('../../regexCommands/COMMAND_NAME');
var should = require('should');


describe('COMMAND_NAME', function() {
    describe('match', function() {
        // Test that the regex only matches expected messages
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
