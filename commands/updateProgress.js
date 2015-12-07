// Set the current progress of some task, and display a progress bar to
// represent it.

function drawProgressBar(percentage) {
    var leftEdge = '▕';
    var rightEdge = '▏';
    var characters = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

    // Marker for left edge.
    var bar = leftEdge;

    // Count how many full blocks are required and add them.
    var fullBlocks = Math.floor(percentage / 10);
    for (var i = 0; i < fullBlocks; i++) {
        bar += characters[8];
    }

    // Add the partial segment at the end. The unicode blocks go down to eigths
    // so split the partial block into (10 ÷ 8) pieces, each size 1.25.
    var partial = Math.floor((percentage - (fullBlocks * 10)) / 1.25);
    bar += characters[partial];

    // Add empty spaces where there are no blocks.
    while (bar.length < 11) {
        bar += rightEdge;
    }

    // Add the marker for the right edge.
    bar += rightEdge;

    return bar;
}


var updateProgress = function(arguments, info, replyCallback) {
    var reply = '';
    var argc = Object.keys(arguments).length;
    var chatData = info.chatData;

    // Default to empty if no progress values are stored.
    chatData.progress = chatData.progress || {};

    // When two arguments are given, the second argument is a percentage.
    if (argc == 2) {
        // Convert the percentage argument to a number.
        var percentage = parseFloat(arguments.percentage);

        if (isNaN(percentage)) {
            reply = 'Error: Argument 2 of updateProgress() should be a number.';
        }
        else {
            if (percentage < 0 || percentage > 100) {
                reply = 'Error: Argument 2 of updateProgress() should be between 0 and 100.';
            }
            else {
                chatData.progress[arguments.name] = percentage;

                // Round to three decimal places, and add to zero to remove
                // trailing zeroes.
                var displayValue = + percentage.toFixed(3);

                reply = 'Progress of ' + arguments.name + ':' + '\n\n' + 
                        drawProgressBar(percentage) + '\n\n' + displayValue + '%';
            }
        }
    }

    // When three arguments are given, the second and third arguments are the
    // numerator and the denominator of a fraction.
    else {
        var x = parseFloat(arguments.x);
        var y = parseFloat(arguments.y);

        if (isNaN(x)) {
            reply = 'Error: Argument 2 of updateProgress() should be a number.';
        }
        else if (isNaN(y)) {
            reply = 'Error: Argument 3 of updateProgress() should be a number.';
        }
        else if (x < 0) {
            reply = 'Error: Argument 2 of updateProgress() should be greater than or equal to 0.';
        }
        else if (y <= 0) {
            reply = 'Error: Argument 3 of updateProgress() should be greater than 0.';
        }
        else if (x > y) {
            reply = 'Error: Argument 2 of updateProgress() should be less than or equal to ' +
                    'argument 3.';
        }

        else {
            var percentage = (x / y) * 100;

            chatData.progress[arguments.name] = percentage;

            // Round to three decimal places, and add to zero to remove
            // trailing zeroes.
            var displayValue = + percentage.toFixed(3);

            reply = 'Progress of ' + arguments.name + ':' + '\n\n' + 
                    drawProgressBar(percentage) + '\n\n' + displayValue + '%';
        }
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['name', 'percentage'],
        description: 'Update the progress of the named task to the given percentage, ' +
                     'and display a progress bar. percentage must be a number between ' + 
                     '0 and 100 inclusive.'
    },
    {
        arguments: ['name', 'x', 'y'],
        description: 'Update the progress of the named task by calculating x÷y as a percentage, ' +
                     'and display a progress bar. x must be greater than or equal to zero, ' +
                     'and y must be greater than zero. x must be less than or equal to y.'
    }
];


module.exports = function init() {
    return {
        name: 'updateProgress',
        func: updateProgress,
        usage: usage
    }
};
