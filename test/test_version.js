
var init = require('../commands/version');
var should = require('should');


describe('version', function() {
    describe('execute', function() {
        it('should display the version number', function(done) {
            var command = init();

            var arguments = {};

            var info = {};

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // Load the current version from package.json and check that
                // the message contains that version.
                var pkg = require('../package.json');
                var regex = new RegExp(pkg.version, 'gi');

                reply.body.should.match(regex);

                done();
            });
        });
    });
});
