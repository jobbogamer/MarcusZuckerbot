
var init = require('../../commands/help');
var should = require('should');


describe('help', function() {
    describe('execute', function() {
        it('should list all commands', function(done) {
            var command = init();

            var arguments = {};

            var info = {
                commands: {}
            };

            var fakeCommands = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz'];
            fakeCommands.forEach(function(command) {
                info.commands[command] = {
                    name: command,
                    usage: [],
                    func: Math.add
                };
            });

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // Each one of the commands should be listed in the reply.
                fakeCommands.forEach(function(command) {
                    reply.body.should.match(new RegExp(command, 'gi'));
                });

                done();
            });
        });


        it('should show help for a specific command', function(done) {
            var command = init();

            var arguments = {
                'command': 'jkl'
            };

            var info = {
                commands: {}
            };

            var fakeCommands = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqr', 'stu', 'vwx', 'yz'];
            fakeCommands.forEach(function(command) {
                info.commands[command] = {
                    name: command,
                    usage: [
                        {
                            arguments: [],
                            description: 'Do a thing ' + command
                        },
                        {
                            arguments: ['number'],
                            description: 'Do a number of things ' + command
                        }
                    ],
                    func: Math.add
                };
            });

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show the usage for 'jkl'.
                reply.should.match(/jkl\(\)/gi);
                reply.should.match(/Do a thing jkl/gi);
                reply.should.match(/jkl\(number\)/gi);
                reply.should.match(/Do a number of things jkl/gi);

                done();
            });
        });
    });
});
