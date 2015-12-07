// Handles received messages and calls the appropriate command functions to 
// generate replies.

var githubIssues = require('./third_party_apis/githubIssues');
var log = require('npmlog');


// Build an 'API' of commands by importing all modules in the commands
// directory. The resulting object will map each module's exports to the
// name of the file.
console.log('Loading command plugins...');
var commandInitialisers = require('require-all')(__dirname + '/commands');

var commands__private = {};
for (var key in commandInitialisers) {
    var command = commandInitialisers[key]();
    
    // If the command initialiser returned an error, or did not return a
    // command, log it to the console.
    if (!command) {
        log.error(key, 'No command object returned.');
    }
    else if (command.error) {
        log.error(key, command.error);
    }
    else if (!command.name) {
        log.error(key, 'Command object has no name field.');
    }
    else if (!command.func) {
        log.error(key, 'Command object has no func field.');
    }
    else if (!command.usage) {
        log.error(key, 'Command object has no usage field.');
    }

    // A command was returned and it has the required fields.
    else {
        commands__private[command.name.toLowerCase()] = command;
        console.log(command.name);
    }
}
console.log('Done.\n');




// The help command is a special case which must be handled here rather than in
// its own file because it needs access to the API object.
var help = function(arguments, info, replyCallback) {
    var reply = '';

    // If no arguments are given, list all available commands.
    if (!arguments.command) {
        reply = 'Available commands:';
        for (var key in commands__private) {
            var command = commands__private[key];
            reply += '\n' + '• ' + command.name;
        }
    }

    // If one argument is given, display usage help for the requested command.
    else {
        needle = arguments.command.toLowerCase();
        command = commands__private[needle];

        if (command) {
            command.usage.map(function (usage) {
                // commandName(arg1, arg2, ...)
                reply += command.name + '(' + usage.arguments.join(', ') + ')';
                reply += '\n' + usage.description + '\n\n';
            });
        }
        else {
            reply = 'No command matching \'' + args[0] + '\'.';
        }
    }

    replyCallback({
        body: reply
    });
}

var helpUsage = [
    {
        arguments: [],
        description: 'Display a list of available commands.'
    },
    {
        arguments: ['command'],
        description: 'Display usage instructions for the given command.'
    }
];

commands__private.help = {
    name: 'help',
    func: help,
    usage: helpUsage
};



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

commands.help = function(arguments, threadID, sender, chat, api, reply) {
    if (arguments.length == 0) {
        // Create a list of all commands.
        var list = '';

        // Just add each command to the end of the list.
        Object.keys(commands).sort().forEach(function(name) {
            list += '• ' + name + '\n';
        });

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


commands.updateprogress = function(arguments, threadID, sender, chat, api, reply) {
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


commands.showprogress = function(arguments, threadID, sender, chat, api, reply) {
    // One argument is required.
    if (!checkArguments('showProgress', arguments, 1, reply)) {
        return;
    }

    if (chat.progress[arguments[0]] != null) {
        reply({
            body: 'Progress of ' + arguments[0] + ':\n\n' + createProgressBar(chat.progress[arguments[0]]) + '\n\n' + chat.progress[arguments[0]].toFixed(3) + '%'
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
    var argRegex = /['‘](.*?)['’]|(-?[0-9.]+)/g;

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


function stringifyAlternativesList(items) {
    if (items.length === 1) {
        return items[0];
    }

    if (items.length === 2) {
        return items[0] + ' or ' + items[1];
    }

    return items.slice(0, items.length - 1).join(', ') + ', or ' + items[items.length - 1];
}



// Handle a received message by calling the appropriate command function.
var handle = function(message, chatData, facebookAPI, reply) {
    // Whitespace before and after the text should be ignored.
    var body = message.body.trim();

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

    if (commandName.charAt(0) === '_') {
        var name = commandName.substr(1, commandName.length - 1);

        var command = commands__private[name];
        if (command) {
            console.log('Matched command ' + command.name + '.');

            // List all the numbers of arguments that the command takes by
            // looking in the usage for the command.
            var argumentLengths = [];
            command.usage.map(function (usage) {
                argumentLengths.push(usage.arguments.length);
            });

            // Check that the right number of arguments have been given.
            var matchedUsageIndex = argumentLengths.indexOf(arguments.length);            
            if (matchedUsageIndex == -1) {
                console.log('Wrong number of arguments given.');
                var error = 'Error: ' + command.name + ' takes ' +
                            stringifyAlternativesList(argumentLengths) + ' ' +
                            (argumentLengths[0] == 1 ? 'argument' : 'arguments') +
                            ' (' + arguments.length + ' given).';
                reply({
                    body: error
                });
                return;
            }

            // Map the given arguments to named arguments as specified in the
            // usage for the command.
            var namedArguments = {};
            var matchedUsage = command.usage[matchedUsageIndex];
            for (var index in arguments) {
                namedArguments[matchedUsage.arguments[index]] = arguments[index];
            }
            console.log('Arguments:\n   ', namedArguments);
            

            // Data to pass to the command function.
            var info = {
                threadID: message.threadID,
                sender: message.senderName,
                attachments: message.attachments,
                chatData: chatData,
                facebookAPI: facebookAPI
            };

            // Send typing indicator to show that the message is being processed.
            var endTypingIndicator = facebookAPI.sendTypingIndicator(message.threadID, function(err, end){});

            // Execute the command.
            command.func(namedArguments, info, function(message, chatData) {
                reply(message, chatData);
            });

            return;
        }
    }

    // If the given command matches an existing command, call it.
    if (commands[commandName]) {
        console.log('Matched command ' + commandName + '.');

        // Send typing indicator to show that the message is being processed.
        var endTypingIndicator = facebookAPI.sendTypingIndicator(message.threadID, function(err, end){});

        // Callback for the command function to call when it's done.
        function callback(message, chat) {
            endTypingIndicator();
            reply(message, chat);
        }

        // Actually call the command function.
        commands[commandName](arguments, message.threadID, message.senderName, chatData, facebookAPI, callback);
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
