
var init = require('../commands/delete');
var should = require('should');
var command = init();


describe('delete', function() {
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


        it('should delete progress variables', function(done) {
            var arguments = {
                variable: 'completion'
            };

            // To avoid conflicts, use an empty variables object, and only have
            // the 'completion' variable in the progress variables.
            var info = {
                chatData: {
                    variables: {},
                    progress: {
                        'completion': 42.42
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
                chat.should.have.property('progress');
                should(chat.progress.completion).be.null();

                done();
            });
        });


        it('should not do anything when a progress variable does not exist', function(done) {
            // Use a variable which is not defined.
            var arguments = {
                variable: 'sausages'
            };

            // Create a chatData where the progress variable doesn't exist, but
            // a regular variable with the same name does exist.
            var info = {
                chatData: {
                    progress: {
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
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.eql(3);

                done();
            });
        });


        it('should ask for clarification in ambiguous situations', function(done) {
            var arguments = {
                variable: 'nuggets'
            };

            // Use a chatData object where there is a 'nuggets' variable in both
            // the variables list and the progress list.
            var info = {
                chatData: {
                    variables: {
                        'nuggets': 3
                    },
                    progress: {
                        'nuggets': 42.42
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should say that the variable exists as both types.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/g);
                reply.body.should.match(/ambiguous/g);
                reply.body.should.match(/delete\('nuggets', 'TYPE'\)/g);

                // Neither nuggets variable should have been deleted.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(3);
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.eql(42.42);

                done();
            });
        });


        it('should delete variables in ambiguous situations', function(done) {
            var arguments = {
                variable: 'nuggets',
                type: 'variable'
            };

            // Use a chatData object where there is a 'nuggets' variable in both
            // the variables list and the progress list.
            var info = {
                chatData: {
                    variables: {
                        'nuggets': 3
                    },
                    progress: {
                        'nuggets': 42.42
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

                // The progress variable should still be present.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.eql(42.42);

                done();
            });
        });


        it('should delete progress variables in ambiguous situations', function(done) {
            var arguments = {
                variable: 'nuggets',
                type: 'PRogress' // Test that type is case insensitive
            };

            // Use a chatData object where there is a 'nuggets' variable in both
            // the variables list and the progress list.
            var info = {
                chatData: {
                    variables: {
                        'nuggets': 3
                    },
                    progress: {
                        'nuggets': 42.42
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display confirmation.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/deleted/g);

                // The progress variable should no longer be present.
                chat.should.be.Object();
                chat.should.have.property('progress');
                should(chat.progress.nuggets).be.null();

                // The regular variable should still be present.
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(3);

                done();
            });
        });
    });
});
