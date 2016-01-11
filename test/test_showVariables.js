
var init = require('../commands/showVariables');
var should = require('should');
var command = init();

describe('showVariables', function() {
    describe('execute', function() {
        it('should list all variables', function(done) {
            var info = {
                chatData: {
                    variables: {
                        nuggets: 8,
                        sausage: 4,
                        biscuits: 11
                    }
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list all variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets\s*(:|=)\s*8/gi);
                reply.body.should.match(/sausage\s*(:|=)\s*4/gi);
                reply.body.should.match(/biscuits\s*(:|=)\s*11/gi);

                done();
            });
        });


        it('should display a message if no variables are defined', function(done) {
            var info = {
                chatData: {
                    variables: {},
                    progress: {}
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list all variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/no variables/gi);

                done();
            });
        });


        it('should list progress variables', function(done) {
            var info = {
                chatData: {
                    variables: {},
                    progress: {
                        'nuggets': 8,
                        'sausage': 4,
                        'biscuits': 11.526666  // Check numbers are rounded;
                                               // if they are not, 11.526 won't
                                               // match 11.527 in the regex.
                    }
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list progress variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets\s*(:|=)\s*8/gi);
                reply.body.should.match(/sausage\s*(:|=)\s*4/gi);
                reply.body.should.match(/biscuits\s*(:|=)\s*11.527/gi);

                done();
            });
        });


        it('should list both regular and progress variables', function(done){
            var info = {
                chatData: {
                    variables: {
                        'biscuits': 11
                    },
                    progress: {
                        'nuggets': 8,
                        'sausage': 4
                    }
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list progress variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets\s*(:|=)\s*8/gi);
                reply.body.should.match(/sausage\s*(:|=)\s*4/gi);
                reply.body.should.match(/biscuits\s*(:|=)\s*11/gi);

                done();
            });
        });
    });
});
