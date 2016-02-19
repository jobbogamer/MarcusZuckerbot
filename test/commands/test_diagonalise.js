
var init = require('../../commands/diagonalise');
var command = init();


describe('diagonalise', function() {
    describe('execute', function() {
        it('should diagonalise short messages', function(done) {
            // Short text, shorter than 19 characters.
            var arguments = {
                text: 'Sausage'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                var expected = '' +
                    'S\n' +
                    '   A\n' +
                    '      U\n' +
                    '         S\n' +
                    '            A\n' +
                    '               G\n' +
                    '                  E';

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(new RegExp(expected, 'g'));

                done();
            });
        });


        it('should add an extra space for the letter I', function(done) {
            // Short text, shorter than 19 characters, which contains a letter I.
            var arguments = {
                text: 'Rain'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                var expected = '' +
                    'R\n' +
                    '   A\n' +
                    '       I\n' +
                    '         N';

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(new RegExp(expected, 'g'));

                done();
            });
        });


        it('should split long text across multiple lines', function(done) {
            // Longer text, longer than 19 characters.
            var arguments = {
                text: 'experimental flavour'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                var expected = '' +
                    'E\n' +
                    '   X\n' +
                    '      P\n' +
                    '         E\n' +
                    '            R\n' +
                    '                I\n' +
                    '                  M\n' +
                    '                     E\n' +
                    '                        N\n' +
                    '                           T\n' +
                    '                              A\n' +
                    '                                 L\n' +
                    '\n\n' +
                    'F\n' +
                    '   L\n' +
                    '      A\n' +
                    '         V\n' +
                    '            O\n' +
                    '               U\n' +
                    '                  R';

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(new RegExp(expected, 'g'));

                done();
            });
        });


        it('should split long text across multiple lines', function(done) {
            // Longer text, where one of the words is longer than 19 characters.
            var arguments = {
                text: 'sing supercalifragilisticexpialidocious'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(too long)|(too many characters)/gi);

                done();
            });
        });


        it('should reject long text if multiline is disabled', function(done) {
            // Longer text, longer than 19 characters.
            var arguments = {
                text: 'experimental flavour',
                multiline: 'false'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(too long)|(too many characters)/gi);

                done();
            });
        });


        it('should treat emoji as one character', function(done) {
            // Text contains emoji.
            var arguments = {
                text: '💩🌭🐊',
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                var expected = '' +
                    '💩\n' +
                    '   🌭\n' +
                    '      🐊\n';

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(new RegExp(expected, 'g'));

                done();
            });
        });


        it('should treat emoji as one character in multiline text', function(done) {
            // Text contains emoji.
            var arguments = {
                text: 'experimental flavour 💩🌭🐊',
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                var expected = '' +
                    'E\n' +
                    '   X\n' +
                    '      P\n' +
                    '         E\n' +
                    '            R\n' +
                    '                I\n' +
                    '                  M\n' +
                    '                     E\n' +
                    '                        N\n' +
                    '                           T\n' +
                    '                              A\n' +
                    '                                 L\n' +
                    '\n\n' +
                    'F\n' +
                    '   L\n' +
                    '      A\n' +
                    '         V\n' +
                    '            O\n' +
                    '               U\n' +
                    '                  R\n' +
                    '\n' +
                    '                        💩\n' +
                    '                           🌭\n' +
                    '                              🐊\n';

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(new RegExp(expected, 'g'));

                done();
            });
        })
    });
});
