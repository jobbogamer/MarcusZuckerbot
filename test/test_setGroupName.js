
var init = require('../commands/setGroupName');
var should = require('should');

// The title and threadID which the command sets will be stored here by the
// mock API function passed to it.
var title = null;
var thread = null;


describe('setGroupName', function() {
    describe('execute', function() {
        it('should set the group name', function(done) {
            var command = init();

            var arguments = {
                name: 'Nugget Appreciation Society'
            };

            var info = {
                facebookAPI: {
                    setTitle: function(newTitle, threadID, callback) {
                        // The command should set the correct title, in the
                        // correct thread.
                        newTitle.should.eql('Nugget Appreciation Society');
                        threadID.should.eql('123456');

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null, threadID);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should contain the new title.
                reply.body.should.match(/Nugget Appreciation Society/g);

                done();
            });
        });

        
        it('should cope with errors', function(done) {
            var command = init();

            var arguments = {
                name: 'Nugget Appreciation Society'
            };

            var info = {
                facebookAPI: {
                    setTitle: function(newTitle, threadID, callback) {
                        // The command should set the correct title, in the
                        // correct thread.
                        newTitle.should.eql('Nugget Appreciation Society');
                        threadID.should.eql('123456');

                        // Call the callback so the command knows the call
                        // failed.
                        callback({
                            error: '404 Page Not Found'
                        },
                        null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should say there was an error.
                reply.body.should.not.match(/Nugget Appreciation Society/g);
                reply.body.should.match(/error/gi);

                done();
            });
        });
    });
});
