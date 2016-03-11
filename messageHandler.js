// Handles received messages and calls the appropriate command functions to
// generate replies.

var githubIssues = require('./third_party_apis/githubIssues');
var log = require('npmlog');

var commands = {};
var regexCommands = [];

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


// Build a second list containing regex commands by importing the modules in
// the regexCommands directory. Since regex plugins are not called by name,
// they can be stored in a simple array.
var loadRegexPlugins = function() {
    var initialisers = require('require-all')(__dirname + '/regexCommands');

    for (var key in initialisers) {
        var init = initialisers[key];

        // Call the initialiser function for the command.
        var command = init();

        // If the command initialiser returned an error, or did not return a
        // command, log it to the console.
        if (!command) {
            log.error(key, 'No command object returned.');
        }
        else if (command.error) {
            log.error(key, command.error);
        }
        else if (!command.pattern) {
            log.error(key, 'Command object has no pattern field.');
        }
        else if (!command.func) {
            log.error(key, 'Command object has no func field.');
        }

        // A command was returned and it has the required fields.
        else {
            regexCommands.push(command);
            console.log(command.name);
        }
    }
}


// Extract the command name and arguments from a message.
function parse(message) {
    // Find the name of the command.
    var commandStart = message.toLowerCase().indexOf('zb.') + 3;
    var commandEnd = message.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = message.substr(commandStart, commandLength);

    // Create a regular expression which can match arguments. String arguments
    // must be enclosed in quotes, but numerical arguments do not.
    var argRegex = /['‘](.*?)['’]|["“](.*?)["”]|(-?[0-9.]+)|(true)|(false)/g;

    // Match any arguments passed in.
    var argStart = commandEnd + 1;
    var argEnd = message.lastIndexOf(')');
    var argLength = argEnd - argStart;
    var match = message.substr(argStart, argLength).match(argRegex) || [];

    for (var i = 0; i < match.length; i++) {
        if (match[i].indexOf('\'') !== -1 || match[i].indexOf('‘') !== -1 ||
            match[i].indexOf('"') !== -1 || match[i].indexOf('“') !== -1) {
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

    // Compile a set of data to pass to the command function.
    var info = {
        threadID: message.threadID,
        sender: message.senderName,
        attachments: message.attachments,
        chatData: chatData,
        facebookAPI: facebookAPI,
        commands: commands
    };

    // Test the message against all the loaded regex plugins to see if any
    // of those match instead. All matching regex commands will be executed.
    var matched = false;
    for (var i = 0; i < regexCommands.length; i++) {
        var command = regexCommands[i];

        var regex = RegExp(command.pattern);

        var matches = [];
        var currentMatch = null;
        while (currentMatch = regex.exec(body)) {
            matches.push(currentMatch);
        }

        if (matches.length > 0) {
            console.log('Matched regex command ' + command.name + '.');
            matched = true;

            // Send typing indicator to show that the message is being processed.
            var endTypingIndicator = facebookAPI.sendTypingIndicator(message.threadID, function(err, end){});

            command.func(matches, info, function(message, chatData) {
                reply(message, chatData);
                endTypingIndicator();
            });
        }
    }
    if (!matched) {
        console.log('Message does not match any regex commands.');
    }

    // Ignore any messages which don't contain 'zb.' as they aren't commands.
    if (body.toLowerCase().indexOf('zb.') === -1 ||
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
        // looking in the usage for the command. If the command has a
        // usage that takes a variable number of arguments, store it as
        // a negative value so that it's marked as variable, but the
        // fixed arguments are still counted.
        var argumentLengths = [];
        var variable = false;
        command.usage.map(function (usage) {
            if (usage.arguments[usage.arguments.length - 1] === '...') {
                argumentLengths.push(0 - (usage.arguments.length - 1));
                variable = true;
            }
            else {
                argumentLengths.push(usage.arguments.length);
            }
        });

        // Check that the right number of arguments have been given.
        var matchedUsageIndex = argumentLengths.indexOf(arguments.length);

        if (variable) {
            for (var i = 0; i < argumentLengths.length; i++) {
                if (arguments.length >= (0 - argumentLengths[i])) {
                    matchedUsageIndex = i;
                    break;
                }
            }
        }

        if (matchedUsageIndex === -1) {
            console.log('Wrong number of arguments given.');
            var argumentCounts = [];
            argumentLengths.map(function (length) {
                if (length >= 0) {
                    argumentCounts.push(length.toString());
                }
                else {
                    argumentCounts.push((0 - length).toString() + '+');
                }
            });


            var error = 'Error: ' + command.name + ' takes ' +
                        stringifyAlternativesList(argumentCounts) + ' ' +
                        ((argumentCounts[0] === '1' && argumentCounts.length === 1) ? 'argument' : 'arguments') +
                        ' (' + arguments.length + ' given). ' +
                        'Try zb.help(\'' + command.name + '\').';
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
            if (matchedUsage.arguments[index] !== '...') {
                namedArguments[matchedUsage.arguments[index]] = arguments[index];
            }
            else {
                // Store the rest of the arguments in 'others' because they
                // haven't been given explicit names.
                namedArguments.others = arguments.slice(index);

                // The ... argument should always be at the end.
                break;
            }
        }
        console.log('Arguments:\n   ', namedArguments);

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
    loadRegexPlugins: loadRegexPlugins,
    handle: handle
};
