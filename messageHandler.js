// Handles received messages and calls the appropriate command functions to 
// generate replies.


// List of commands which can be called.
var commands = {};

// Usage string for each command.
var docstrings = {};





// Enforce the number of arguments required for a function.
function checkArguments(functionName, arguments, requiredNumber, reply) {
    if (arguments.length != requiredNumber) {
        reply({
            body: 'Error: ' + functionName + '() takes ' + requiredNumber + ' arguments (' + arguments.length + ' given).'
        });
        return false;
    }
    return true;
}


// Create a progress bar out of unicode block characters.
function createProgressBar(value) {
    var leftEdge = '▕';
    var rightEdge = '▏';
    var characters = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

    // Marker for left edge.
    var bar = leftEdge;

    // Count how many full blocks are required and add them.
    var fullBlocks = Math.floor(value / 10);
    for (var i = 0; i < fullBlocks; i++) {
        bar += characters[8];
    }

    // Add the partial segment at the end. The unicode blocks go down to eigths
    // so split the partial block into (10 ÷ 8) pieces, each size 1.25.
    var partial = Math.floor((value - (fullBlocks * 10)) / 1.25);
    bar += characters[partial];

    // Add empty spaces where there are no blocks.
    while (bar.length < 11) {
        bar += rightEdge;
    }

    // Add the marker for the right edge.
    bar += rightEdge;

    return bar;
}





// Commands

commands.help = function(arguments, threadID, chat, api, reply) {
    if (arguments.length == 0) {
        // Create a list of all commands.
        var list = '';

        // Just add each command to the end of the list.
        for (var command in commands) {
            list += '• ' + command + '\n';
        }

        // Add some explanation to the message.
        var messageBody = 'Available commands:\n';
        messageBody += list;

        // Build and return the reply.
        reply({
            body: messageBody
        });
    }
    else {
        // Find the usage instructions for the named command.
        var commandName = arguments[0];
        var commandNameLowercase = commandName.toLowerCase();

        // Return help for the command, if it exists.
        if (docstrings[commandNameLowercase]) {
            var messageBody = 'Help for ' + commandNameLowercase + ':';
            for (var i = 0; i < docstrings[commandNameLowercase].usage.length; i++) {
                messageBody += '\n\n';
                messageBody += docstrings[commandNameLowercase].usage[i] + '\n';
                messageBody += docstrings[commandNameLowercase].details[i];
            }

            reply({
                body: messageBody
            });
        }
        else {
            // No command matching the argument.
            reply({
                body: 'No command called \'' + commandName + '\'.'
            });
        }
    }
};
docstrings.help = {};
docstrings.help.usage = [
    'help()',
    'help(command)'
];
docstrings.help.details = [
    'Display a list of available commands.',
    'Display usage instructions for the given command.'
];


commands.countmessages = function(arguments, threadID, chat, api, reply) {
    api.getThreadList(0, 0, function(err, arr) {
        if (err) {
            reply({
                body: err
            });
        }

        reply({
            body: 'The conversation has ' + arr[0].messageCount + ' messages.'
        });
    });
}
docstrings.countmessages = {};
docstrings.countmessages.usage = [
    'countMessages()'
];
docstrings.countmessages.details = [
    'Display the total number of messages in the conversation.'
];


commands.setvalue = function(arguments, threadID, chat, api, reply) {
    // Two arguments are required.
    if (!checkArguments('setValue', arguments, 2, reply)) {
        return;
    }

    // Default to empty if no variables are stored.
    chat.variables = chat.variables || {};
    
    // Convert argument 2 into a number.
    var value = parseFloat(arguments[1]);
    if (isNaN(value)) {
        // See if they're trying to set a variable to the value of another variable.
        if (chat.variables[arguments[1]] != null) {
            var newValue = chat.variables[arguments[1]];
            chat.variables[arguments[0]] = newValue;
            reply({
                body: arguments[0] + ' has been set to ' + newValue + '.'
            },
            chat);
        }
        else {
            reply({
                body: 'Error: argument 2 of setValue() should be a number or existing variable name.'
            });
        }
    }
    else {
        chat.variables[arguments[0]] = value;
        reply({
            body: arguments[0] + ' has been set to ' + value + '.'
        },
        chat);
    }
}
docstrings.setvalue = {};
docstrings.setvalue.usage = [
    'setValue(variable, value)'
];
docstrings.setvalue.details = [
    'Set the value of the given variable, and display confirmation.'
];


commands.getvalue = function(arguments, threadID, chat, api, reply) {
    // One argument is required.
    if (!checkArguments('getValue', arguments, 1, reply)) {
        return;
    }

    if (chat.variables[arguments[0]] != null) {
        reply({
            body: arguments[0] + ' is currently set to ' + chat.variables[arguments[0]] + '.'
        });
    }
    else {
        reply({
            body: '\'' + arguments[0] + '\' is not defined.'
        });
    }

}
docstrings.getvalue = {};
docstrings.getvalue.usage = [
    'getValue(variable)'
];
docstrings.getvalue.details = [
    'Display the current value of the given variable.'
];


commands.showvariables = function(arguments, threadID, chat, api, reply) {
    // Default to an empty object if no variables exist.
    chat.variables = chat.variables || {};

    if (Object.keys(chat.variables).length == 0) {
        reply({
            body: 'No variables are defined.'
        });
    }
    else {
        messageBody = '';

        Object.keys(chat.variables).forEach(function(key) {
            if (chat.variables[key] != null) {
                messageBody += key + ' = ' + chat.variables[key] + '\n';
            }
        });

        reply({
            body: messageBody
        });
    }
}
docstrings.showvariables = {};
docstrings.showvariables.usage = [
    'showVariables()'
];
docstrings.showvariables.details = [
    'List every defined variable and its current value.'
];


commands.deletevariable = function(arguments, threadID, chat, api, reply) {
    // Default to an empty object if no variables exist.
    chat.variables = chat.variables || {};

    if (chat.variables[arguments[0]] != null) {
        chat.variables[arguments[0]] = null;
        reply({
            body: arguments[0] + ' has been deleted.'
        },
        chat);
    }
    else {
        reply({
            body: '\'' + arguments[0] + '\' is not defined.'
        });
    }
}
docstrings.deletevariable = {};
docstrings.deletevariable.usage = [
    'deleteVariable(variable)'
];
docstrings.deletevariable.details = [
    'Unset the given variable and delete it from the conversation.'
];


commands.increment = function(arguments, threadID, chat, api, reply) {
    // One argument is required.
    if (!checkArguments('increment', arguments, 1, reply)) {
        return;
    }

    if (chat.variables[arguments[0]] != null) {
        var newValue = chat.variables[arguments[0]] + 1;
        chat.variables[arguments[0]] = newValue;

        reply({
            body: arguments[0] + ' is now set to ' + newValue + '.'
        },
        chat);
    }
    else {
        reply({
            body: '\'' + arguments[0] + '\' is not defined.'
        });
    }
}
docstrings.increment = {};
docstrings.increment.usage = [
    'increment(variable)'
];
docstrings.increment.details = [
    'Increment the value of the given variable by one, and display the new value.'
];


commands.decrement = function(arguments, threadID, chat, api, reply) {
    // One argument is required.
    if (!checkArguments('decrement', arguments, 1, reply)) {
        return;
    }

    if (chat.variables[arguments[0]] != null) {
        var newValue = chat.variables[arguments[0]] - 1;
        chat.variables[arguments[0]] = newValue;

        reply({
            body: arguments[0] + ' is now set to ' + newValue + '.'
        },
        chat);
    }
    else {
        reply({
            body: '\'' + arguments[0] + '\' is not defined.'
        });
    }
}
docstrings.decrement = {};
docstrings.decrement.usage = [
    'decrement(variable)'
];
docstrings.decrement.details = [
    'Decrement the value of the given variable by one, and display the new value.'
];


commands.updateprogress = function(arguments, threadID, chat, api, reply) {
    if (arguments.length < 2 || arguments.length > 3) {
        reply({
            body: 'Error: updateProgress() takes 2 or 3 arguments (' + arguments.length + 'given).'
        });
        return;
    }

    var progress = null;

    // The three argument version performs a division between arguments 2
    // and 3, and uses that as the progress value.
    if (arguments.length === 3) {
        // Convert arguments 2 and 3 into numbers.
        var value1 = parseFloat(arguments[1]);
        var value2 = parseFloat(arguments[2]);
        if (isNaN(value1) || isNaN(value2)) {
            reply({
                body: 'Error: arguments 2 and 3 of updateProgress() should be numbers.'
            });
            return;
        }

        progress = (value1 / value2) * 100;
    }

    if (arguments.length === 2) {
        // Convert argument 2 into a number.
        var value = parseFloat(arguments[1]);
        if (isNaN(value) || value < 0 || value > 100) {
            reply({
                body: 'Error: argument 2 of updateProgress() should be a number between 0 and 100.'
            });
            return
        }

        progress = value;
    }

    // Default to empty if no progress values are stored.
    chat.progress = chat.progress || {};

    // Round to 3 decimal places for display.
    var display = +progress.toFixed(3);

    chat.progress[arguments[0]] = progress;
    reply({
        body: 'Progress of ' + arguments[0] + ':\n\n' + createProgressBar(progress) + '\n\n' + display + '%'
    },
    chat);
}
docstrings.updateprogress = {};
docstrings.updateprogress.usage = [
    'updateProgress(name, percentage)',
    'updateProgress(name, x, y)'
];
docstrings.updateprogress.details = [
    'Update the progress of the named task to the given percentage, and display a progress bar. Percentage must be a number between 0 and 100 inclusive.',
    'Update the progress of the named task by calculating x÷y as a percentage, and display a progress bar.'
]


commands.showprogress = function(arguments, threadID, chat, api, reply) {
    // One argument is required.
    if (!checkArguments('showProgress', arguments, 1, reply)) {
        return;
    }

    if (chat.progress[arguments[0]] != null) {
        reply({
            body: 'Progress of ' + arguments[0] + ':\n\n' + createProgressBar(chat.progress[arguments[0]]) + '\n\n' + chat.progress[arguments[0]] + '%'
        },
        chat);
    }
    else {
        reply({
            body: '\'' + arguments[0] + '\' is not defined.'
        });
    }
}
docstrings.showprogress = {};
docstrings.showprogress.usage = [
    'showProgress(name)'
];
docstrings.showprogress.details = [
    'Display a progress bar showing the current progress of the named task.'
];






// Extract the command name and arguments from a message.
function parse(message) {
    // Find the name of the command.
    var commandStart = message.indexOf('zb.') + 3;
    var commandEnd = message.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = message.substr(commandStart, commandLength).toLowerCase();

    // Create a regular expression which can match arguments. String arguments
    // must be enclosed in quotes, but numerical arguments do not.
    var argRegex = /['‘](.+?)['’]|(-?[0-9.]+)/g;

    // Match any arguments passed in.
    var argStart = commandEnd + 1;
    var argEnd = message.indexOf(')');
    var argLength = argEnd - argStart;
    var match = message.substr(argStart, argLength).match(argRegex) || [];

    for (var i = 0; i < match.length; i++) {
        if (match[i].indexOf('\'') !== -1 || match[i].indexOf('‘') !== -1) {
            match[i] = match[i].substr(1, match[i].length - 2);
        }
    }

    return {
        command: commandName,
        arguments: match
    };
}






// Handle a received message by calling the appropriate command function.
var handle = function(message, threadID, chat, api, reply) {
    // Whitespace before and after the text should be ignored.
    var body = message.trim();

    // Ignore any messages which don't start with 'zb.' as they aren't commands.
    if (body.indexOf('zb.') !== 0 || body.indexOf('(') === -1 || body.indexOf(')') === -1) {
        console.log('Message does not contain a command.');
        reply(null);
        return;
    }

    // Parse the command name and arguments.
    var parsed = parse(body);
    var commandName = parsed.command;
    var arguments = parsed.arguments;
    console.log('Command name is \'' + commandName + '\'.');
    if (arguments.length > 0) {
        console.log('Arguments are ' + arguments.join(', ') + '.');
    }
    else {
        console.log('No arguments given.');
    }

    

    // If the given command matches an existing command, call it.
    if (commands[commandName]) {
        console.log('Matched command ' + commandName + '.');

        // Send typing indicator to show that the message is being processed.
        api.sendTypingIndicator(threadID, function(err, end){});

        // Callback for the command function to call when it's done.
        function callback(message, chat) {
            reply(message, chat);
        }

        // Actually call the command function.
        commands[commandName](arguments, threadID, chat, api, callback);
    }
    else {
        // A command wasn't matched
        console.log('No matching command exists.');
        
        reply({
            body: 'No command matching \'' + commandName + '\'.'
        });
    }
}


// Only export the handle function, everything else is private.
module.exports.handle = handle;
