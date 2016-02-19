
var init = require('../../commands/incrementProgress');
var should = require('should');

var command = init();


describe('incrementProgress', function() {
    describe('execute', function() {
        it('should add one to a progress', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: {
                            current: 35,
                            target: 50
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                reply.body.should.match(/nuggets/g);
                reply.body.should.match(/36/g);
                reply.body.should.match(/50/g);
                reply.body.should.match(/72%/g);
                reply.body.should.match(/▕███████▏▏▏▏/g);

                // The current value of the progress should have increased, but
                // the target should have stayed the same.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(36);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(50);

                done();
            });
        });


        it("should error when the progress doesn't exist", function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {}
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/not ((defined)|(exist))/gi);

                // The progress should not have been created.
                chat.progress.should.not.have.property('nuggets');

                done();
            });
        });


        it('should set the value to target if adding one makes it too large', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: {
                            current: 49.75,
                            target: 50
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                reply.body.should.match(/nuggets/g);
                reply.body.should.match(/50/g);
                reply.body.should.match(/50/g);
                reply.body.should.match(/100%/g);
                reply.body.should.match(/▕██████████▏/g);

                // The current value of the progress should have been set to the
                // value of target, since adding one would have made value
                // greater than target.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(50);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(50);

                done();
            });
        });
    });
});
