
var init = require('../commands/setValue');
var command = init();

describe('setValue', function() {
    describe('execute', function() {
        it('should create new variables if they are not defined', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 5
            };

            var info = {
                chatData: {
                    variables: {
                        sausage: 8
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display confirmation with the name of the
                // variable and its new value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/5/g);

                // The variable should have been set.
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(5);

                // The existing variable should have been left alone.
                chat.variables.should.have.property('sausage');
                chat.variables.sausage.should.eql(8);

                done();
            });
        });


        it('should update existing variables', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 5
            };

            var info = {
                chatData: {
                    variables: {
                        sausage: 8,
                        nuggets: 3
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display confirmation with the name of the
                // variable and its new value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/5/g);

                // The variable should have been set.
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(5);

                // The existing variable should have been left alone.
                chat.variables.should.have.property('sausage');
                chat.variables.sausage.should.eql(8);

                done();
            });
        });


        it('should set variables using the value of other variables', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 'sausage'
            };

            var info = {
                chatData: {
                    variables: {
                        sausage: 8,
                        nuggets: 3
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should display confirmation with the name of the
                // variable and its new value.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/8/g);

                // The variable should have been set.
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(8);

                // The existing variable should have been left alone.
                chat.variables.should.have.property('sausage');
                chat.variables.sausage.should.eql(8);

                done();
            });
        });


        it('should cope when the second variable does not exist', function(done) {
            var arguments = {
                variable: 'nuggets',
                value: 'sausage'
            };

            var info = {
                chatData: {
                    variables: {
                        nuggets: 3
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should say that the other variable doesn't exist.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // The variables should not have changed.
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(3);
                chat.variables.should.not.have.property('sausage');

                done();
            });
        });
    });
});
