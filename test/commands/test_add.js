
var init = require('../../commands/add');
var command = init();
var should = require('should');



describe('add', function() {
    describe('execute', function() {
        it('should add to a variable when it exists', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 5
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
                reply.body.should.match(/8/g);

                // The variable should have increased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(8);

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
                        nuggets: 12
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

                // The variable should have increased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(12 + 2.87);

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
                        nuggets: 14.7787
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

                // The variable should have increased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(14.7787 + 2.1);

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
                        nuggets: 3,
                        sausages: 6
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display the new value of the variable.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/9/g);

                // The variable should have increased.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(9);

                done();
            });
        });


        it('should not do anything when a variable does not exist', function(done) {
            // Use a variable which is not defined.
            var arguments = {
                variable: 'sausages',
                value: 5
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
