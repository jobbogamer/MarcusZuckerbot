// Send a random thumbs up sticker.

var helpers = require('../helpers');

var thumbs = [
    '767334476626295', '767334493292960', '767334546626288', '767334563292953',
    '1578471192388331', '633722786647031', '298592863654246', '460938394028009',
    '481172875355135', '501183200001758', '210852215739480', '700042543365244',
    '738554239552636', '789355224486725', '830546363633252', '1398251813726335',
    '1402232810073796', '1498876500353480', '645898295491022', '209575149232987',
    '608186339201777', '229801597168456', '787824561343296', '1530358233871652',
    '645898515491000', '944850062231601'
];

var sendThumb = function(arguments, info, replyCallback) {
    var chatData = info.chatData;

    // Pick a random sticker from the list.
    var index = helpers.randBetween(0, thumbs.length);
    var sticker = thumbs[index];

    var message = {
        body: '',
        sticker: sticker
    };

    replyCallback(message);
}

var usage = [
    {
        arguments: [],
        description: 'Send a random thumbs-up sticker.'
    }
];


module.exports = function init() {
    return {
        name: 'sendThumb',
        func: sendThumb,
        usage: usage
    }
};
