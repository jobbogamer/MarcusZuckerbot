
var init = require('../commands/showVariables');
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
                    variables: {
                    }
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
    });
});
