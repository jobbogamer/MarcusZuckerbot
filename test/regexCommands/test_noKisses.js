
var init = require('../../regexCommands/noKisses');
var should = require('should');

describe('noKisses', function() {
	describe('match', function() {
		var command = init();
		var regex = new RegExp(command.pattern);

		it('should match messages ending with a kiss', function() {
			var matches = 'hello x'.match(regex);
			should.exist(matches);
			matches.should.have.length(1);
		});


		it ('should not match messages which do not contain a kiss', function() {
			var matches = 'hello there'.match(regex);
			if (matches) {
				matches.should.have.length(0);
			}
		});


		it('should not match messages that happen to contain the letter x', function() {
			var matches = 'I had an x ray'.match(regex);
			if (matches) {
				matches.should.have.length(0);
			}
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
