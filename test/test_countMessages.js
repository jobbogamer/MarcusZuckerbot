
var init = require('../commands/countMessages');

var error = false;


describe('countMessages', function() {
    describe('execute', function() {
        it('should return a count of the messages', function(done) {
            var command = init();

            var facebookApiMock = {
                getThreadList: function(start, end, callback) {
                    callback(null, [{
                        messageCount: 42                            
                    }]);
                }
            };

            // The command takes no arguments.
            var arguments = {};

            // Pass in the mock facebook API.
            var info = {
                facebookAPI: facebookApiMock
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');

                // Make sure the message contains the count.
                reply.body.should.match(/42/g);

                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            var command = init();

            var facebookApiMock = {
                getThreadList: function(start, end, callback) {
                    callback({
                        error: 2
                    }, null);
                }
            };

            // The command takes no arguments.
            var arguments = {};

            // Pass in the mock facebook API.
            var info = {
                facebookAPI: facebookApiMock
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');

                // Make sure the message says there was an error.
                reply.body.should.match(/error/gi);

                done();
            });
        });
    });
});
