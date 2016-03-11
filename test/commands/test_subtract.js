
var init = require('../../commands/subtract');
var command = init();
var should = require('should');



describe('subtract', function() {
    describe('execute', function() {
        it('should subtract from a variable when it exists', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 3
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 5
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/2/g);

                // The variable should have increased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(2);

                done();
            });
        });


        it('should be clever with decimal operands', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 2.87
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 17.74
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable. Note
                // the use of \b to check that the output is rounded to the
                // correct number of decimal places.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/14.87\b/g);

                // The variable should have decreased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(17.74 - 2.87);

                done();
            });
        });


        it('should be clever with decimal variables', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 2.1
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 18.9787
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable. Note
                // the use of \b to check that the output is rounded to the
                // correct number of decimal places.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/16.8787\b/g);

                // The variable should have decreased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(18.9787 - 2.1);

                done();
            });
        });


        it('should use the value of another variable as the operand', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 'sausages'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 6,
                        sausages: 4
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/2/g);

                // The variable should have increased.
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
                variable: 'sausages',
                value: 3
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 5
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should not display the value 4, because the variable
                // should be untouched.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // The nuggets variable should stay the same.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(5);

                done();
            });
        });


        it('should not do anything the operand variable does not exist', function(done) {
            // Use a variable which is not defined.
            var arguments = {
                variable: 'nuggets',
                value: 'sausages'
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
