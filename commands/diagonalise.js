// Resend a message with a character on each line, spaced to create a diagonal
// line effect.

var diagonalise = function(arguments, info, replyCallback) {
    var reply = '';

    var text = arguments.text.toUpperCase();

    // Text cannot be longer than 19 characters long.
    if (text.length > 19) {
        reply = 'The text is too long to diagonalise.';
    }
    else {
        for (var i = 0; i < text.length; i++) {
            var character = text.charAt(i);
            for (var j = 0; j < i; j++) {
                reply += '   ';
            }

            if (character === 'I') {
                reply += ' ';
            }

            reply += character;
            reply += '\n';
        }
    }

    replyCallback({
        body: reply
    });
}

var usage = [
    {
        arguments: ['text'],
        description: 'Resend a message with one character on each line, spaced to create a ' +
                     'diagonal line effect.'
    }
];


module.exports = function init() {
    return {
        name: 'diagonalise',
        func: diagonalise,
        usage: usage
    };
}
