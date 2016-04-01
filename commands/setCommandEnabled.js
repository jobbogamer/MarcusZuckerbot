// Enable and disable other commands.

var setCommandEnabled = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = '';

    // Default to an empty list of commands.
    chatData.disabledCommands = chatData.disabledCommands || [];

    var name = arguments.command.toLowerCase();
    var index = chatData.disabledCommands.indexOf(name);

    if (arguments.setting === 'false') {
        if (index !== -1) {
            reply = arguments.command + ' is already disabled for this conversation.'
        }
        else {
            chatData.disabledCommands.push(name);
            reply = arguments.command + ' has been disabled for this conversation.'
        }
    }
    else {
        if (index === -1) {
            reply = arguments.command + ' is already enabled for this conversation.'
        }
        else {
            var newArray = [];
            chatData.disabledCommands.forEach(function(element) {
                if (element !== name) {
                    newArray.push(element);
                }
            });
            chatData.disabledCommands = newArray;

            reply = arguments.command + ' has been enabled for this conversation.'
        }
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['command', 'setting'],
        description: 'Enable or disable the given command. Set `setting` to false to ' +
                     'disable the command, or set it to true to enable the command.'
    }
];


module.exports = function init() {
    return {
        name: 'setCommandEnabled',
        func: setCommandEnabled,
        usage: usage
    }
};
