
var init = require('../commands/listVariables');
var should = require('should');
var command = init();

describe('listVariables', function() {
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
                        nuggets: {
                            current: 8,
                            target: 100
                        },
                        sausage:  {
                            current: 4,
                            target: 150
                        },
                        biscuits: {
                            current: 11.527,
                            target: 100
                        }
                    }
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list progress variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets\s*(:|=)\s*8\/100/gi);
                reply.body.should.match(/sausage\s*(:|=)\s*4\/150/gi);
                reply.body.should.match(/biscuits\s*(:|=)\s*11.527\/100/gi);

                done();
            });
        });


        it('should list both regular and progress variables', function(done){
            var info = {
                chatData: {
                    variables: {
                        biscuits: 11
                    },
                    progress: {
                        nuggets: {
                            current: 8,
                            target: 100
                        },
                        sausage: {
                            current: 4,
                            target: 150
                        }
                    }
                }
            };

            command.func({}, info, function replyCallback(reply, chat) {
                // The reply should list progress variables.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets\s*(:|=)\s*8\/100/gi);
                reply.body.should.match(/sausage\s*(:|=)\s*4\/150/gi);
                reply.body.should.match(/biscuits\s*(:|=)\s*11/gi);

                done();
            });
        });
    });
});
