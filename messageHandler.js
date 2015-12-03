// Handles received messages and calls the appropriate command functions to 
// generate replies.


// List of commands which can be called.
var commands = {};

// Usage string for each command.
var docstrings = {};





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

        // Return help for the command, if it exists.
        if (docstrings[commandName]) {
            var messageBody = 'Help for ' + commandName + ':';
            for (var i = 0; i < docstrings[commandName].usage.length; i++) {
                messageBody += '\n\n';
                messageBody += docstrings[commandName].usage[i] + '\n';
                messageBody += docstrings[commandName].details[i];
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


commands.countMessages = function(arguments, threadID, chat, api, reply) {
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
docstrings.countMessages = {};
docstrings.countMessages.usage = [
    'countMessages()'
];
docstrings.countMessages.details = [
    'Display the total number of messages in the conversation.'
];


commands.setValue = function(arguments, threadID, chat, api, reply) {
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
            chat[arguments[0]] = value;
            reply({
                body: '\'' + arguments[0] + '\' has been set to ' + value + '.'
            },
            chat);
        }
    }
}
docstrings.setValue = {};
docstrings.setValue.usage = [
    'setValue(variable, value)'
];
docstrings.setValue.details = [
    'Set the value of the given variable, and display confirmation.'
];





// Extract the command name and arguments from a message.
function parse(message) {
    // Find the name of the command.
    var commandStart = message.indexOf('zb.') + 3;
    var commandEnd = message.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = message.substr(commandStart, commandLength);

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
        return null;
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
        api.sendTypingIndicator(threadID, function(err, end) {});

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
        reply(null);
    }
}


// Only export the handle function, everything else is private.
module.exports.handle = handle;
