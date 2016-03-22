
var init = require('../../commands/setChatEmoji');
var should = require('should');


describe('setChatEmoji', function() {
    describe('execute', function() {
        it('should set the emoji', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                emoji: '🙀'
            };

            var info = {
                facebookAPI: {
                    changeThreadEmoji: function(emoji, threadID, callback) {
                        // The command should set the correct colour, in the
                        // correct thread.
                        emoji.should.eql('🙀');
                        threadID.should.eql('123456');

                        functionCalled = true;

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should have actually been called.
                functionCalled.should.be.true();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show confirmation.
                reply.body.should.match(/🙀/gi);

                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                emoji: '🙀'
            };

            var info = {
                facebookAPI: {
                    changeThreadEmoji: function(emoji, threadID, callback) {
                        // The command should set the correct colour, in the
                        // correct thread.
                        emoji.should.eql('🙀');
                        threadID.should.eql('123456');

                        functionCalled = true;

                        // Call the callback as if an error occurred.
                        callback({
                            error: 'Something went wrong.'
                        });
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should have actually been called.
                functionCalled.should.be.true();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should not show confirmation.
                reply.body.should.not.match(/🙀/gi);

                // The reply should say there was an error.
                reply.body.should.match(/error/gi);

                done();
            });
        });
    });
});
