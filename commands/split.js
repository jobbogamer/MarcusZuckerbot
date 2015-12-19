// Split a message into mutiple messages.

var api = null;

function send(text, character, threadID) {
    var message = {
        body: text[character]
    };

    api.sendMessage(message, threadID, function(err, res) {
        if (character < text.length - 1) {
            send(text, character + 1, threadID);
        }
    });
}

var split = function(arguments, info, replyCallback) {
    api = info.facebookAPI;

    // Remove whitespace from the text, because facebook won't send a message
    // which only contains whitespace.
    var text = arguments.text.replace(/\s/g, '');

    // To treat emoji as one character, a for...of loop must be used. Since a
    // loop will not work due to sendMessage being async, each character needs
    // to be extracted before starting the recursive call.
    var characters = [];
    for (character of text) {
        characters.push(character);
    }

    send(characters, 0, info.threadID);
    replyCallback(null);
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
