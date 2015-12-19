
var should = require('should');
var init = require('../commands/split');
var command = init();


// The text which was sent, joined back together.
var sentText = '';
var numberOfMessages = 0;


// Override of sendMessage, which adds the message body to sentText.
var sendMessage = function(message, threadID, callback) {
    sentText += message.body + "/";
    numberOfMessages++;

    threadID.should.eql('12345678');

    callback(null, null);
}


describe('split', function() {
    describe('execute', function() {
        beforeEach(function() {
            sentText = '';
            numberOfMessages = 0;
        });


        it('should split text into multiple messages', function(done) {
            var arguments = {
                text: "Sausage"
            };

            var info = {
                threadID: '12345678',
                facebookAPI: {
                    sendMessage: sendMessage
                }
            };

            command.func(arguments, info, function replyCallback(reply, chatData) {
                should(reply).be.null();

                sentText.should.eql('S/a/u/s/a/g/e/');
                numberOfMessages.should.eql(7);

                done();
            });
        });


        it('should remove whitespace', function(done) {
            var arguments = {
                text: "Sausage   rolls  are lovely"
            };

            var info = {
                threadID: '12345678',
                facebookAPI: {
                    sendMessage: sendMessage
                }
            };

            command.func(arguments, info, function replyCallback(reply, chatData) {
                should(reply).be.null();

                sentText.should.eql('S/a/u/s/a/g/e/r/o/l/l/s/a/r/e/l/o/v/e/l/y/');
                numberOfMessages.should.eql(21);

                done();
            });
        });


        it('should treat emoji as one character', function(done) {
            var arguments = {
                text: "💩🌭🐊"
            };

            var info = {
                threadID: '12345678',
                facebookAPI: {
                    sendMessage: sendMessage
                }
            };

            command.func(arguments, info, function replyCallback(reply, chatData) {
                should(reply).be.null();

                sentText.should.eql('💩/🌭/🐊/');
                numberOfMessages.should.eql(3);

                done();
            });
        });
    });
});
