// Resend a message with a character on each line, spaced to create a diagonal
// line effect.

var diagonalise = function(arguments, info, replyCallback) {
    var reply = '';
    var argc = Object.keys(arguments).length;
    var text = arguments.text.toUpperCase();

    // Argument 2 must be a boolean.
    if (argc == 2 && arguments.multiline !== 'true' && arguments.multiline !== 'false') {
        reply = 'Error: Argument 2 of diagonalise() must be a boolean.';
    }
    else {
        // Use the simple one-line version if multiline is specifically turned
        // off, or if the text is short enough to fit on one line anyway.
        if ((argc == 2 && arguments.multiline === 'false') || arguments.text.length <= 19) {
            // Text cannot be longer than 19 characters long.
            if (text.length > 19) {
                reply = 'The text is too long to diagonalise.';
            }
            else {

                var indent = 0;

                for (var character of text) {
                    for (var j = 0; j < indent; j++) {
                        reply += '   ';
                    }
                    indent++;

                    if (character === 'I') {
                        reply += ' ';
                    }

                    reply += character;
                    reply += '\n';
                }
            }
        }

        // If multiline is true, be more clever about it and create multiple lines.
        else {
            // Go word by word, and if the next word would push the current line
            // over the 19 character limit, start a new word.
            var length = 0;
            var words = text.split(' ');

            for (var i = 0; i < words.length; i++) {
                var word = words[i];

                // Still can't diagonalise if one of the words is over 19
                // characters long. (Supercalifragilisticexpialidocius)
                if (word.length > 19) {
                    reply = 'Word ' + (i + 1) + ' is too long to diagonalise.';
                    break;
                }

                // If the word doesn't fit on the current line, start a new line.
                if (length + word.length > 19) {
                    length = 0;
                    reply += '\n';
                }

                // Add each character of the word.
                var indent = 0;

                for (var character of word) {
                    // Indent.
                    for (var k = 0; k < length + indent; k++) {
                        reply += '   ';
                    }
                    indent++;

                    if (character === 'I') {
                        reply += ' ';
                    }

                    reply += character;
                    reply += '\n';
                }

                length += word.length;

                // Add the space for the end of the word.
                if (i < words.length - 1) {
                    reply += '\n';
                    length += 1;
                }
            }
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
    },
    {
        arguments: ['text', 'multiline'],
        description: 'Resend a message with one character on each line, spaced to create a ' +
                     'diagonal line effect. Set multiline to false to stop the message from ' +
                     'being split into multiple lines.'
    }
];


module.exports = function init() {
    return {
        name: 'diagonalise',
        func: diagonalise,
        usage: usage
    };
}
