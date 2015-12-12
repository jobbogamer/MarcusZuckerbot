
var init = require('../commands/sendThumb');
var should = require('should');


var possibleStickers = [
    '767334476626295', '767334493292960', '767334546626288', '767334563292953',
    '1578471192388331', '633722786647031', '298592863654246', '460938394028009',
    '481172875355135', '501183200001758', '210852215739480', '700042543365244',
    '738554239552636', '789355224486725', '830546363633252', '1398251813726335',
    '1402232810073796', '1498876500353480', '645898295491022', '209575149232987',
    '608186339201777', '229801597168456', '787824561343296', '1530358233871652',
    '645898515491000'
];


describe('sendThumb', function() {
    describe('execute', function() {
        it('should do send a thumb sticker from the list', function(done) {
            var command = init();

            var arguments = {};

            var info = {};

            // Do the test 10 times, because the command uses randomness.
            for (var i = 0; i < 10; i++) {
                command.func(arguments, info, function replyCallback(reply, chat) {
                    reply.should.be.Object();
                    reply.should.have.property('body');
                    reply.body.should.be.String();

                    // The message should not contain text.
                    reply.body.should.have.length(0);

                    // The message should have a sticker.
                    reply.should.have.property('sticker');
                    reply.sticker.should.be.String();

                    // The sticker should come from the list of thumb stickers.
                    reply.sticker.should.equalOneOf(possibleStickers);
                });
            }

            done();
        });
    });
});
