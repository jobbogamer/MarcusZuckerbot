// Describe your plugin here.

var rename = function(arguments, info, replyCallback) {
    var reply = '';
    var chatData = info.chatData;

    chatData.variables = chatData.variables || {};

    var oldName = arguments.oldName;
    var newName = arguments.newName;

    // Check that the variable actually exists.
    var value = chatData.variables[oldName];
    var targetValue = chatData.variables[newName];

    if (value == null) {
        reply = oldName + ' is not defined.';
    }
    // Check that the new variable doesn't already exist.
    else if (targetValue != null) {
        reply = 'A variable called ' + newName + ' already exists.';
    }
    // Actually rename the variable.
    else {
        chatData.variables[newName] = chatData.variables[oldName];
        chatData.variables[oldName] = null;
        reply = oldName + ' has been renamed to ' + newName + '.';
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['oldName', 'newName'],
        description: 'Rename the given variable with the given new name.'
    }
];


module.exports = function init() {
    return {
        name: 'rename',
        func: rename,
        usage: usage
    }
};
