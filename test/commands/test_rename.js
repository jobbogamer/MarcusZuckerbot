
var init = require('../../commands/rename');
var should = require('should');


describe('rename', function() {
    describe('execute', function() {
        it('should rename an existing variable', function(done) {
            var command = init();

            var arguments = {
                'oldName': 'nuggets',
                'newName': 'sausages'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 12
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the old and new names of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/sausages/gi);

                // The new variable should exist, and should have the same value
                // as the old one.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('sausages');
                chat.variables.sausages.should.eql(12);

                // The old variable should no longer exist.
                should(chat.variables.nuggets).be.null();

                done();
            });
        });


        it('should cope when a variable does not exist', function(done) {
            var command = init();

            var arguments = {
                'oldName': 'nuggets',
                'newName': 'sausages'
            };

            var info = {
                chatData: {
                    variables: {
                        pizza: 12
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should say the variable doesn't exist.
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // The new variable should not have been created.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.not.have.property('sausages');

                done();
            });
        });


        it('should cope when the new name already exists', function(done) {
            var command = init();

            var arguments = {
                'oldName': 'nuggets',
                'newName': 'sausages'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 12,
                        sausages: 7
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should say the variable already exists.
                reply.body.should.match(/already exists/gi);

                // The variables should not have been altered.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(12);
                chat.variables.should.have.property('sausages');
                chat.variables.sausages.should.eql(7);

                done();
            });
        });
    });
});
