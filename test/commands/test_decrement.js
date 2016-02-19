
var init = require('../../commands/decrement');
var command = init();


describe('decrement', function() {
    describe('execute', function() {
        it('should decrement a variable when it exists', function(done) {
            var arguments = {
                variable: 'nuggets'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 3
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/2/g);

                // The variable should have decreased by one.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(2);

                done();
            });
        });


        it('should not do anything when a variable does not exist', function(done) {
            // Use a variable which is not defined.
            var arguments = {
                variable: 'sausages'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 3
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should not display the value 2, because the variable
                // should be untouched.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not defined)|(not exist)/gi);
                reply.body.should.not.match(/2/g);

                // The nuggets variable should stay the same.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(3);

                done();
            });
        });
    });
});
