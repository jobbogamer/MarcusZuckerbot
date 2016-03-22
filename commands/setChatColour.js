// Set the colour of the current conversation.

var availableColours = {
    'Red':           '#FA3C4C',
    'ProductRed':    '#B44546',
    'Orange':        '#FF7E29',
    'Apricot':       '#E87A6C',
    'Yellow':        '#FFC300',
    'Green':         '#B6C872',
    'LightGreen':    '#13CF13',
    'DarkGreen':     '#67B868',
    'Mint':          '#A5C093',
    'Cyan':          '#44BEC7',
    'Turquoise':     '#B9C8CA',
    'Blue':          '#77BADB',
    'LightBlue':     '#20CEF5',
    'DarkBlue':      '#6699CC',
    'MidnightBlue':  '#4A4D5D',
    'RoyalBlue':     '#5F7EBC',
    'ZuckerbotBlue': '#3A4B95', 
    'Lilac':         '#B6C3E2',
    'Purple':        '#7646FF',
    'Lavender':      '#4A4D5D',
    'Pink':          '#E8837E',
    'LightPink':     '#F0C5D4',
    'VintageRose':   '#D8B9B8',
    'Fog':           '#A5A9AE',
    'Stone':         '#C0BCB7',
    'Walnut':        '#A69485',
    'Grey':          '#808080',
    'Black':         '#000000',
    'Default':       ''
}

var setChatColour = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var threadID = info.threadID;
    var newColour = arguments.colour.toLowerCase();
    var reply = '';

    // Check that either a hex value or a named colour was passed in.
    var matches = false;
    Object.keys(availableColours).forEach(function colourMatches(colourName) {
        if (newColour === colourName.toLowerCase()) {
            matches = true;

            // Substitute the colour argument for the named colour.
            newColour = availableColours[colourName].toLowerCase();
        }
    });

    if (!matches && !newColour.match(/#?[0-9a-f]{6}/)) {
        reply = 'The requested colour is invalid. Pass either a hex value (#000000), ' +
                'or one of the following:\n';
        Object.keys(availableColours).forEach(function(colourName) {
            reply += '• ' + colourName + '\n';
        });

        var message = {
            body: reply
        };

        replyCallback(message);
        return;
    }

    // If the colour doesn't start with a # symbol, add one, unless the chosen
    // colour was "default", in which case an empty string is required.
    if (!newColour.startsWith('#') && newColour.length > 0) {
        newColour = '#' + newColour;
    }

    // Make the API call to change the colour.
    info.facebookAPI.changeThreadColor(newColour, threadID, function callback(err) {
        if (err) {
            reply = 'An error occurred when changing the chat colour.';
        }
        else {
            if (newColour.length > 0) {
                reply = 'The chat colour has been changed to ' + newColour + '.';
            }
            else {
                reply = 'The chat colour has been reset to the default.';
            }
        }

        var message = {
            body: reply
        };

        replyCallback(message);
    });
}

var usage = [
    {
        arguments: ['colour'],
        description: 'Set the colour of the conversation to the given colour.'
    }
];


module.exports = function init() {
    return {
        name: 'setChatColour',
        func: setChatColour,
        usage: usage
    }
};
