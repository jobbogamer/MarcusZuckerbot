// Handles received messages and calls the appropriate command functions to 
// generate replies.


// List of commands which can be called.
var commands = {};

// Usage string for each command.
var docstrings = {};





// Create a progress bar out of unicode block characters.
function createProgressBar(value) {
    var leftEdge = '▕';
    var rightEdge = '▏';
    var characters = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

    // Re-assess the value as a fraction of 96 rather than 100, so it
    // can be expressed in eigths.
    var newValue = (value / 100.0) * 96;

    // Marker for left edge.
    var bar = leftEdge;

    // Count how many full blocks are required and add them.
    var fullBlocks = Math.floor(newValue / 8);
    for (var i = 0; i < fullBlocks; i++) {
        bar += characters[8];
    }

    // Add the partial segment at the end.
    bar += characters[Math.floor(newValue % 8)];

    // Add empty spaces where there are no blocks.
    while (bar.length < 13) {
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
    if (arguments.length != 2) {
        reply({
            body: 'Error: setValue() takes 2 arguments (' + arguments.length + ' given).'
        });
    }
    else {
        // Convert argument 2 into a number.
        var value = parseFloat(arguments[1]);
        if (isNaN(value)) {
            reply({
                body: 'Error: argument 2 of setValue() should be a number'
            });
        }
        else {
            // Default to empty if no variables are stored.
            chat.variables = chat.variables || {};

            chat.variables[arguments[0]] = value;
            reply({
                body: '\'' + arguments[0] + '\' has been set to ' + value + '.'
            },
            chat);
        }
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
    if (arguments.length != 1) {
        reply({
            body: 'Error: getValue() takes 1 argument (' + arguments.length + ' given).'
        });
    }
    else {
        if (chat.variables[arguments[0]]) {
            reply({
                body: '\'' + arguments[0] + '\' is currently set to ' + chat.variables[arguments[0]] + '.'
            });
        }
        else {
            reply({
                body: '\'' + arguments[0] + '\' is not defined.'
            });
        }
    }
}
docstrings.getvalue = {};
docstrings.getvalue.usage = [
    'getValue(variable)'
];
docstrings.getvalue.details = [
    'Display the current value of the given variable.'
];


commands.increment = function(arguments, threadID, chat, api, reply) {
    if (arguments.length != 1) {
        reply({
            body: 'Error: increment() takes 1 argument (' + arguments.length + ' given).'
        });
    }
    else {
        if (chat.variables[arguments[0]]) {
            var newValue = chat.variables[arguments[0]] + 1;
            chat.variables[arguments[0]] = newValue;

            reply({
                body: '\'' + arguments[0] + '\' is now set to ' + newValue + '.'
            },
            chat);
        }
        else {
            reply({
                body: '\'' + arguments[0] + '\' is not defined.'
            });
        }
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
    if (arguments.length != 1) {
        reply({
            body: 'Error: decrement() takes 1 argument (' + arguments.length + ' given).'
        });
    }
    else {
        if (chat.variables[arguments[0]]) {
            var newValue = chat.variables[arguments[0]] - 1;
            chat.variables[arguments[0]] = newValue;

            reply({
                body: '\'' + arguments[0] + '\' is now set to ' + newValue + '.'
            },
            chat);
        }
        else {
            reply({
                body: '\'' + arguments[0] + '\' is not defined.'
            });
        }
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
    if (arguments.length != 2) {
        reply({
            body: 'Error: updateProgress() takes 2 arguments (' + arguments.length + ' given).'
        });
    }
    else {
        // Convert argument 2 into a number.
        var value = parseFloat(arguments[1]);
        if (isNaN(value) || value < 0 || value > 100) {
            reply({
                body: 'Error: argument 2 of updateProgress() should be a number between 0 and 100.'
            });
        }
        else {
            // Default to empty if no progress values are stored.
            chat.progress = chat.progress || {};

            chat.progress[arguments[0]] = value;
            reply({
                body: 'Progress of \'' + arguments[0] + '\':\n\n' + createProgressBar(value) + '\n\n' + value + '%'
            },
            chat);
        }
    }
}





// Extract the command name and arguments from a message.
function parse(message) {
    // Find the name of the command.
    var commandStart = message.indexOf('zb.') + 3;
    var commandEnd = message.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = message.substr(commandStart, commandLength).toLowerCase();

    // Create a regular expression which can match arguments. String arguments
    // must be enclosed in quotes, but numerical arguments do not.
    var argRegex = /['‘](.+?)['’]|([0-9.]+)/g;

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
