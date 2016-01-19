// Create, update, and display progress bars.

var helpers = require('../helpers');

function displayProgress(name, oldValue, chatData, replyCallback) {
    // Check the progress actually exists.
    if (chatData.progress[name] == null) {
        var message = {
            body: name + ' is not defined.'
        };

        replyCallback(message, chatData);
        return;
    }

    var progress = chatData.progress[name];

    var percentage = (progress.current / progress.target) * 100;
    var displayPercentage = helpers.round(percentage);

    var reply = 'Progress of ' + name + ': ' + progress.current + '/' + progress.target + ' (' + displayPercentage + '%)\n\n' +
                helpers.drawProgressBar(percentage);

    var message = {
        body: reply
    };

    // Although the chatData has not changed in this function, it has to
    // be passed into the callback because this function is called by
    // other functions which *do* modify it.
    replyCallback(message, chatData);
}


function createProgress(name, value, target, chatData, replyCallback) {
    var reply = '';

    if (value < 0) {
        reply = 'Error: Value must not be negative.';
    }
    else if (value > target) {
        reply = 'Error: Value must be less than or equal to target.';
    }
    else if (target <= 0) {
        reply = 'Error: Target must be greater than 0.';
    }
    else {
        // Create the new progress in the chatData object.
        chatData.progress[name] = {
            current: value,
            target: target
        };

        // Display the newly created progress.
        displayProgress(name, null, chatData, replyCallback);
        return;
    }

    // If an error occurred, build a message and send it. Do not call
    // displayProgress because showing a progress bar when an error occurred
    // makes no sense.
    var message = {
        body: reply
    };
    replyCallback(message, chatData);
}


function updateProgress(name, newValue, chatData, replyCallback) {
    // Check the progress actually exists.
    if (chatData.progress[name] == null) {
        var message = {
            body: name + ' is not defined.'
        };

        replyCallback(message, chatData);
        return;
    }

    // Get the old value so a delta can be shown on the graph.
    var oldValue = chatData.progress[name].current;

    // Update the progress in the chatDataObject.
    chatData.progress[name].current = newValue;

    // Display the newly updated progress.
    displayProgress(name, oldValue, chatData, replyCallback);
}


var progress = function(arguments, info, replyCallback) {
    var name = arguments.name;
    var chatData = info.chatData;
    var result = null;

    // Initialise chatData to an empty object in case no data exists for the
    // current chat.
    if (chatData == null) {
        chatData = {
            progress: {}
        };
    }

    // Parse numerical arguments into float values.
    var value = null;
    var target = null;
    var error = '';

    if (arguments.value != null) {
        value = parseFloat(arguments.value);
        if (isNaN(value)) {
            error = 'Error: Value must be a number.';
        }
    }
    if (arguments.target != null) {
        target = parseFloat(arguments.target);
        if (isNaN(target)) {
            error = 'Error: Target must be a number.';
        }
    }

    // If a parsing error occurred, stop here.
    if (error.length > 0) {
        var message = {
            body: error
        };

        replyCallback(message, chatData);
        return;
    }

    // Count how many arguments were passed in to decide which function to call.
    var argc = Object.keys(arguments).length;

    // 1 argument means the caller is trying to display a progress.
    if (argc === 1) {
        displayProgress(name, null, chatData, replyCallback);
    }
    // 2 arguments means the caller is either creating one with an implicit
    // target, or updating an existing one.
    else if (argc === 2) {
        if (chatData.progress[name] == null) {
            // Implicitly set the target value to 100, because no target was
            // given. Don't worry, the usage description explains it.
            createProgress(name, value, 100, chatData, replyCallback);
        }
        else {
            updateProgress(name, value, chatData, replyCallback);
        }
    }
    // And 3 means the caller is creating one by specifying the target.
    else if (argc === 3) {
        createProgress(name, value, target, chatData, replyCallback);
    }
}

var usage = [
    {
        arguments: ['name'],
        description: 'Display the current value of the specified progress.'
    },
    {
        arguments: ['name', 'value'],
        description: 'Update the value of the specified progress, or if no progress ' +
                     'exists with that name, create a new one with the target set ' +
                     'to 100, so that the given value is interpreted as a percentage.'
    },
    {
        arguments: ['name', 'value', 'target'],
        description: 'Create a new progress with the given name, initial value, and ' +
                     'target. Value must be less than target, and both values must be ' +
                     '≥ 0.'
    }
];


module.exports = function init() {
    return {
        name: 'progress',
        func: progress,
        usage: usage
    }
};
