// Show the current value of a progress variable.

var helpers = require('../helpers');


var showProgress = function(arguments, info, replyCallback) {
    var reply = '';
    var chatData = info.chatData;

    var percentage = chatData.progress[arguments.name];
    if (percentage != null) {
        // Round to three decimal places, and add to zero to remove
        // trailing zeroes.
        var displayValue = + percentage.toFixed(3);

        reply = 'Progress of ' + arguments.name + ':' + '\n\n' + 
                helpers.drawProgressBar(percentage) + '\n\n' + displayValue + '%';
    }
    else {
        reply = arguments.name + ' is not defined.';
    }

    replyCallback({
        body: reply
    });
}

var usage = [
    {
        arguments: ['name'],
        description: 'Display a progress bar showing the current progress of the named task.'
    }
];


module.exports = function init() {
    return {
        name: 'showProgress',
        func: showProgress,
        usage: usage
    }
};
