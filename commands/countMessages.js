// Count the number of messages in the history of the current conversation.

var countMessages = function(arguments, info, replyCallback) {
    info.facebookAPI.getThreadList(0, 0, function(err, conversations) {
        if (err) {
            console.log(err);
            replyCallback({
                body: 'An error occurred when counting the messages.'
            });
        }

        replyCallback({
            body: 'There are ' + conversations[0].messageCount + ' messages in the conversation.'
        });
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
