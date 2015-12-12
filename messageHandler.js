// Handles received messages and calls the appropriate command functions to 
// generate replies.

var githubIssues = require('./third_party_apis/githubIssues');
var log = require('npmlog');

var commands = {};

// Build an 'API' of commands by importing all modules in the commands
// directory. The resulting object will map each module's exports to the
// name of the file.
var loadPlugins = function() {
    var commandInitialisers = require('require-all')(__dirname + '/commands');

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
            commands[command.name.toLowerCase()] = command;
            console.log(command.name);
        }
    }
}



// The help command is a special case which must be handled here rather than in
// its own file because it needs access to the API object.
var help = function(arguments, info, replyCallback) {
    var reply = '';

    // If no arguments are given, list all available commands.
    if (!arguments.command) {
        reply = 'Available commands:';
        for (var key in commands) {
            var command = commands[key];
            reply += '\n' + '• ' + command.name;
        }
    }

    // If one argument is given, display usage help for the requested command.
    else {
        needle = arguments.command.toLowerCase();
        command = commands[needle];

        if (command) {
            command.usage.map(function (usage) {
                // commandName(arg1, arg2, ...)
                reply += command.name + '(' + usage.arguments.join(', ') + ')';
                reply += '\n' + usage.description + '\n\n';
            });
        }
        else {
            reply = 'No command matching \'' + arguments.command + '\'.';
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

commands.help = {
    name: 'help',
    func: help,
    usage: helpUsage
};



// Extract the command name and arguments from a message.
function parse(message) {
    // Find the name of the command.
    var commandStart = message.toLowerCase().indexOf('zb.') + 3;
    var commandEnd = message.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = message.substr(commandStart, commandLength);

    // Create a regular expression which can match arguments. String arguments
    // must be enclosed in quotes, but numerical arguments do not.
    var argRegex = /['‘](.*?)['’]|(-?[0-9.]+)|(true)|(false)/g;

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
        command: commandName.toLowerCase(),
        arguments: match,
        originalCommand: commandName
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
    if (body.toLowerCase().indexOf('zb.') !== 0 ||
        body.indexOf('(') === -1 || body.indexOf(')') === -1) {
        console.log('Message does not contain a command.');
        reply(null);
        return;
    }

    // Parse the command name and arguments.
    var parsed = parse(body);
    var name = parsed.command;
    var arguments = parsed.arguments;

    // Find the command.
    var command = commands[name];
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
            endTypingIndicator();
        });

        return;
    }

    // A command wasn't matched.
    else {
        console.log('No matching command exists.');
        
        reply({
            body: 'No command matching \'' + parsed.originalCommand + '\'.'
        });
    }
}



module.exports = {
    loadPlugins: loadPlugins,
    handle: handle
};
