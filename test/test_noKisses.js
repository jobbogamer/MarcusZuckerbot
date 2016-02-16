
var init = require('../regexCommands/noKisses');
var should = require('should');

describe('noKisses', function() {
	describe('match', function() {
		var command = init();
		var regex = new RegExp(command.pattern);

		it('should match messages ending with a kiss', function(done) {
			var matches = 'hello x'.match(regex);
			matches.should.not.have.length(0);

			done();
		});


		it ('should not match messages which do not contain a kiss', function(done) {
			var matches = 'hello there'.match(regex);
			if (matches) {
				matches.should.have.length(0);
			}

			done();
		});


		it('should not match messages that happen to contain the letter x', function(done) {
			var matches = 'I had an x ray'.match(regex);
			if (matches) {
				matches.should.have.length(0);
			}

			done();
		});
	});


    describe('execute', function() {
        it('should send the sticker', function(done) {
            var command = init();

            command.func([], {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The message should not contain text.
		        reply.body.should.have.length(0);

		        // The message should have a sticker.
		        reply.should.have.property('sticker');
		        reply.sticker.should.be.String();

        		// The sticker should be the correct one.
        		reply.sticker.should.eql('396449327165840');

                done();
            });
        });
    });
});
