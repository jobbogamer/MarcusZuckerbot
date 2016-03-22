
var init = require('../../commands/setChatColour');
var should = require('should');


describe('setChatColour', function() {
    describe('execute', function() {
        it('should set the colour to a hex value', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                colour: '#123abc'
            };

            var info = {
                facebookAPI: {
                    changeThreadColor: function(color, threadID, callback) {
                        // The command should set the correct colour, in the
                        // correct thread.
                        color.should.eql('#123abc');
                        threadID.should.eql('123456');

                        functionCalled = true;

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should have actually been called.
                functionCalled.should.be.true();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show confirmation.
                reply.body.should.match(/#123abc/gi);

                done();
            });
        });


        it('should set the colour back to the default', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                colour: 'default'
            };

            var info = {
                facebookAPI: {
                    changeThreadColor: function(color, threadID, callback) {
                        // The command should set the correct colour, in the
                        // correct thread.
                        color.should.eql('');
                        threadID.should.eql('123456');

                        functionCalled = true;

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should have actually been called.
                functionCalled.should.be.true();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show confirmation.
                reply.body.should.match(/default/gi);

                done();
            });
        });


        it('should set the colour using colour names', function(done) {
            var command = init();

            var colours = {
                'blue':       '#20CEF5',
                'lightblue':  '#20CEF5',
                'darkblue':   '#6699CC',
                'cyan':       '#44BEC7',
                'turquoise':  '#44BEC7',
                'green':      '#13CF13',
                'lightgreen': '#13CF13',
                'darkgreen':  '#67B868',
                'yellow':     '#FFC300',
                'orange':     '#FF7E29',
                'red':        '#FA3C4C',
                'pink':       '#FF5CA1',
                'lilac':      '#D696BB',
                'purple':     '#7646FF',
                'lavender':   '#A695C7',
            }

            Object.keys(colours).forEach(function (colourName) {
                var colour = colours[colourName];

                var functionCalled = false;

                var arguments = {
                    colour: colourName
                };

                var info = {
                    facebookAPI: {
                        changeThreadColor: function(color, threadID, callback) {
                            // The command should set the correct colour, in the
                            // correct thread.
                            color.should.eql(colour.toLowerCase());
                            threadID.should.eql('123456');

                            functionCalled = true;

                            // Call the callback so the command knows the call
                            // succeeded.
                            callback(null);
                        }
                    },
                    threadID: '123456'
                };

                command.func(arguments, info, function replyCallback(reply, chat) {
                    // The changeThreadColor function should have actually been called.
                    functionCalled.should.be.true();

                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // The reply should show confirmation.
                    reply.body.should.match(new RegExp(colour, 'gi'));
                });
            });

            done();
        });


        it('should fail on non-hex arguments', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                colour: '#hexval'
            };

            var info = {
                facebookAPI: {
                    changeThreadColor: function(color, threadID, callback) {
                        functionCalled = true;

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should not have been called.
                functionCalled.should.be.false();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show an error.
                reply.body.should.match(/invalid/gi);

                done();
            });
        });


        it('should fail on unknown named colours', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                colour: 'sausage'
            };

            var info = {
                facebookAPI: {
                    changeThreadColor: function(color, threadID, callback) {
                        functionCalled = true;

                        // Call the callback so the command knows the call
                        // succeeded.
                        callback(null);
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should not have been called.
                functionCalled.should.be.false();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should show an error.
                reply.body.should.match(/invalid/gi);

                done();
            });
        });


        it('should cope with errors', function(done) {
            var command = init();

            var functionCalled = false;

            var arguments = {
                colour: '123abc'
            };

            var info = {
                facebookAPI: {
                    changeThreadColor: function(color, threadID, callback) {
                        // The command should set the correct colour, in the
                        // correct thread.
                        color.should.eql('#123abc');
                        threadID.should.eql('123456');

                        functionCalled = true;

                        // Call the callback with an error.
                        callback({
                            error: 'A Bad Thing happened'
                        });
                    }
                },
                threadID: '123456'
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The changeThreadColor function should have actually been called.
                functionCalled.should.be.true();

                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should not show confirmation.
                reply.body.should.not.match(/#123abc/gi);

                // The reply should say there was an error.
                reply.body.should.match(/error/gi);

                done();
            });
        });
    });
});
