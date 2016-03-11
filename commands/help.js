// Describe your plugin here.

var help = function(arguments, info, replyCallback) {
    var reply = '';

    var commands = info.commands;

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

var usage = [
    {
        arguments: [],
        description: 'Display a list of available commands.'
    },
    {
        arguments: ['command'],
        description: 'Display usage instructions for the given command.'
    }
];


module.exports = function init() {
    return {
        name: 'help',
        func: help,
        usage: usage
    }
};
