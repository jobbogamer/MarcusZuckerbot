
var init = require('../../commands/get');
var command = init();

describe('get', function() {
    describe('execute', function() {
        it('should display the value of a variable that exists', function(done) {
            var arguments = {
                variable: 'nuggets'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 5
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the variable name and the value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/5/g);

                done();
            });
        });


        it('should cope when the variable does not exist', function(done) {
            var arguments = {
                variable: 'sausage'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 5
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the variable name and the value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not defined)|(not exist)/gi);

                done();
            });
        });
    });
});
