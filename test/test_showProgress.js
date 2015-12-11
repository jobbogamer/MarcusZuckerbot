
var init = require('../commands/showProgress');
var command = init();

describe('showProgress', function() {
    describe('execute', function() {
        it('should show a progress bar', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: 67.8
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain a progress bar and the numerical
                // value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/▕██████▊▏▏▏▏/gi);
                reply.body.should.match(/67\.8/g);

                done();
            });
        });


        it('should show an empty progress bar when the value is 0', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: 0
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain a progress bar and the numerical
                // value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/▕▏▏▏▏▏▏▏▏▏▏▏/gi);
                reply.body.should.match(/0/g);

                done();
            });
        });


        it('should show a full progress bar when the value is 100', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: 100
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain a progress bar and the numerical
                // value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/▕██████████▏/gi);
                reply.body.should.match(/100/g);

                done();
            });
        });


        it('should round the value to three decimal places', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: 23.45678
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain a progress bar and the numerical
                // value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/23\.457/g);

                done();
            });
        });


        it('should cope when a value is not defined', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        sausage: 42
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain a message.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // There should not be a progress bar in the message.
                reply.body.should.not.match(/▏/gi);

                done();
            });
        });
    });
});
