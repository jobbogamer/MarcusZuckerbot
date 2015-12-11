
var init = require('../commands/deleteVariable');
var should = require('should');
var command = init();


describe('deleteVariable', function() {
    describe('execute', function() {
        it('should delete a variable when it exists', function(done) {
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
                // The reply should display confirmation.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/deleted/g);

                // The variable should no longer be present.
                chat.should.be.Object();
                chat.should.have.property('variables');
                should(chat.variables.nuggets).be.null();

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
                // The reply should not say 'deleted' because nothing should
                // have been deleted.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.not.match(/deleted/g);
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
