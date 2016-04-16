// Count the number of messages in the history of the current conversation.

var helpers = require('../helpers');

var countMessages = function(arguments, info, replyCallback) {
    info.facebookAPI.getThreadInfo(info.threadID, function(err, threadInfo) {
        if (err) {
            replyCallback({
                body: 'An error occurred when counting the messages.'
            });
        }
        else {
            var count = threadInfo.messageCount;

            replyCallback({
                body: 'There are ' + helpers.addThousandsSeparators(count) +
                      ' messages in the conversation.'
            });
        }
    });
}

var usage = [
    {
        arguments: [],
        description: 'Display the total number of messages in the conversation.'
    }
];


module.exports = function init() {
    return {
        name: 'countMessages',
        func: countMessages,
        usage: usage
    }
};
