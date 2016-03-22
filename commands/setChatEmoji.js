// Change the emoji for the current chat.

var setChatEmoji = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var newEmoji = arguments.emoji;
    var reply = '';

    // Check that a non-empty string was passed as the emoji.
    if (newEmoji.length === 0) {
        reply = 'An emoji must be passed in.'

        var message = {
            body: reply
        };

        replyCallback(message);
        return;
    }

    // Call the Facebook API function.
    info.facebookAPI.changeThreadEmoji(newEmoji, info.threadID, function callback(err) {
        if (err) {
            reply = 'An error occurred when changing the emoji.';
        }
        else {
            reply = 'The emoji has been changed to ' + newEmoji + '.';
        }

        var message = {
            body: reply
        };

        replyCallback(message);
    });    
}

var usage = [
    {
        arguments: ['emoji'],
        description: 'Set the emoji for the conversation to the given emoji.\n' +
                     'Note that certain emoji will not work as expected.'
    }
];


module.exports = function init() {
    return {
        name: 'setChatEmoji',
        func: setChatEmoji,
        usage: usage
    }
};
