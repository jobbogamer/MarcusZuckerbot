// Handles received messages and calls the appropriate command functions to 
// generate replies.


// List of commands which can be called.
var commands = {};





// Commands

// Return a list of available commands.
commands.help = function() {
    var list = '';

    for (var command in commands) {
        list += '• ' + command + '\n';
    }

    var messageBody = 'Available commands:\n';
    messageBody += list;

    var reply = {
        body: messageBody
    };

    return reply;
}




// Handle a received message by calling the appropriate command function.
var handle = function(message, chat) {
    // Whitespace before and after the text should be ignored.
    var body = message.trim();

    // Ignore any messages which don't start with 'zb.' as they aren't commands.
    if (body.indexOf('zb.') !== 0 || body.indexOf('(') === -1) {
        console.log('Message does not contain a command.');
        return null;
    }

    // Find the name of the command.
    var commandStart = body.indexOf('zb.') + 3;
    var commandEnd = body.indexOf('(');
    var commandLength = commandEnd - commandStart;
    var commandName = body.substr(commandStart, commandLength);
    console.log('Command name is \'' + commandName + '\'.');

    // If the given command matches an existing command, call it.
    if (commands[commandName]) {
        console.log('Matched command ' + commandName + '.');
        return commands[commandName]();
    }

    // A command wasn't matched
    console.log('No matching command exists.');
    return null;
}



module.exports.handle = handle;
