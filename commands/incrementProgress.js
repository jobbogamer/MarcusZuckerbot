// Add one to the value of an existing progress.

var helpers = require('../helpers');

var incrementProgress = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = '';

    var name = arguments.name;

    var progress = chatData.progress[name];
    if (progress == null) {
        reply = name + ' is not defined.';
    }
    else {
        // Increment the progress, clamping to the target value if the new value
        // is too large.
        progress.current = Math.min(progress.current + 1, progress.target);

        var percentage = (progress.current / progress.target) * 100;
        var displayPercentage = helpers.round(percentage);

        var reply = 'Progress of ' + name + ': ' + progress.current + '/' + progress.target + ' (' + displayPercentage + '%)\n\n' +
                    helpers.drawProgressBar(percentage);
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['name'],
        description: 'Add one to the value of the specified progress.'
    }
];


module.exports = function init() {
    return {
        name: 'incrementProgress',
        func: incrementProgress,
        usage: usage
    }
};
