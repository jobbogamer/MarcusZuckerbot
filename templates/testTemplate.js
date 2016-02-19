
var init = require('../../commands/COMMAND_NAME');
var should = require('should');


describe('COMMAND_NAME', function() {
    describe('execute', function() {
        it('should do something', function(done) {
            var command = init();

            var arguments = {};

            var info = {};

            command.func(arguments, info, function replyCallback(reply, chat) {
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
