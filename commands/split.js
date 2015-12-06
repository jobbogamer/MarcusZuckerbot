// Split a message into mutiple messages.

var api = null;

function send(text, character, threadID) {
    api.sendMessage(text.charAt(character), threadID, function(err, res) {
        if (character < text.length - 1) {
            send(text, character + 1, threadID);
        }
    });
}

var split = function(arguments, info, replyCallback) {
    api = info.facebookAPI;
    send(arguments.text.replace(/\s/g, ''), 0, info.threadID);
}

var usage = [
    {
        arguments: ['text'],
        description: 'Split a message into multiple messages, each containing one character ' +
                     'of the original message.'
    }
];


module.exports = function init() {
    return {
        name: 'split',
        func: split,
        usage: usage
    }
};
