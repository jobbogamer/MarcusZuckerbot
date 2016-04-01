
var init = require('../../commands/setCommandEnabled');
var should = require('should');


describe('setCommandEnabled', function() {
    describe('execute', function() {
        it('should disable a command', function(done) {
            var command = init();

            var arguments = {
                command: 'sendThumb',
                setting: 'false'
            };

            var info = {
                chatData: {
                    disabledCommands: []
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show confirmation.
                reply.body.should.match(/sendThumb/gi);
                reply.body.should.match(/disabled/gi);

                // The command should have been added to the list of disabled
                // commands for the chat, in lowercase.
                chat.should.have.property('disabledCommands');
                chat.disabledCommands.should.be.Array();
                chat.disabledCommands.should.containEql('sendthumb');

                done();
            });
        });


        it('should re-enable a command', function(done) {
            var command = init();

            var arguments = {
                command: 'sendThumb',
                setting: 'true'
            };

            var info = {
                chatData: {
                    disabledCommands: ['sendgif', 'sendthumb', 'nokisses']
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show confirmation.
                reply.body.should.match(/sendThumb/gi);
                reply.body.should.match(/enabled/gi);

                // The command should have been removed from the list of
                // disabled commands for the chat.
                chat.should.have.property('disabledCommands');
                chat.disabledCommands.should.be.Array();
                chat.disabledCommands.should.not.containEql('sendthumb');

                // The other disabled commands should still be disabled.
                chat.disabledCommands.should.containEql('sendgif');
                chat.disabledCommands.should.containEql('nokisses');

                done();
            });
        });


        it('should not disable an already-disabled command', function(done) {
            var command = init();

            var arguments = {
                command: 'sendThumb',
                setting: 'false'
            };

            var info = {
                chatData: {
                    disabledCommands: ['sendthumb']
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should say the command is already disabled.
                reply.body.should.match(/sendThumb/gi);
                reply.body.should.match(/already disabled/gi);

                // The command should still be in the list of disabled
                // commands for the chat, in lowercase.
                chat.should.have.property('disabledCommands');
                chat.disabledCommands.should.be.Array();
                chat.disabledCommands.should.containEql('sendthumb');

                done();
            });
        });


        it('should not enable an already-enabled command', function(done) {
            var command = init();

            var arguments = {
                command: 'sendThumb',
                setting: 'true'
            };

            var info = {
                chatData: {
                    disabledCommands: []
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should say the command is already enabled.
                reply.body.should.match(/sendThumb/gi);
                reply.body.should.match(/already enabled/gi);

                // The command should not been added to the list of
                // disabled commands for the chat.
                chat.should.have.property('disabledCommands');
                chat.disabledCommands.should.be.Array();
                chat.disabledCommands.should.not.containEql('sendthumb');

                done();
            });
        });
    });
});
