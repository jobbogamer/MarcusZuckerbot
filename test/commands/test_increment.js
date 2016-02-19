
var init = require('../../commands/increment');
var command = init();


describe('increment', function() {
    describe('execute', function() {
        it('should increment a variable when it exists', function(done) {
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
                reply.body.should.match(/4/g);

                // The variable should have increased by one.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(4);

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
                // The reply should not display the value 4, because the variable
                // should be untouched.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.not.match(/4/g);
                reply.body.should.match(/(not defined)|(not exist)/gi);

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
