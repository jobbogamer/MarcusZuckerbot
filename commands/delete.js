// Delete a variable from the conversation.

var _delete = function(arguments, info, replyCallback) {
    var reply = '';
    var chatData = info.chatData;

    // Default to an empty object in case no variables are set.
    chatData.variables = chatData.variables || {};
    chatData.progress = chatData.progress || {};

    var variable = chatData.variables[arguments.variable];
    var progressVariable = chatData.progress[arguments.variable];
    var type = (arguments.type) ? arguments.type.toLowerCase() : null;

    // Reject incorrect type arugments. Valid ones are "variable", "progress",
    // and "both".
    if (type != null && type !== 'variable' && type !== 'progress' && type != 'both') {
        reply = 'Error: type must be one of \'variable\', \'progress\', or \'both\'.';
    }
    // If both a variable and a progress variable exist, don't guess which one
    // to delete, but ask for clarification instead.
    else if (variable != null && progressVariable != null && type == null) {
        reply = 'Error: Command is ambiguous; ' + arguments.variable + ' exists ' +
                'as both a variable and a progress variable.\n' +
                'Please use delete(\'' + arguments.variable + '\', \'TYPE\') instead.';
    }
    else if (variable != null && (type == null || type === 'variable' || (type === 'both' && progressVariable == null))) {
        chatData.variables[arguments.variable] = null;
        reply = arguments.variable + ' has been deleted.';
    }
    else if (progressVariable != null && (type == null || type === 'progress' || (type === 'both' && variable == null))) {
        chatData.progress[arguments.variable] = null;
        reply = 'Progress of ' + arguments.variable + ' has been deleted.';
    }
    else if (variable != null && progressVariable != null && type === 'both') {
        chatData.variables[arguments.variable] = null;
        chatData.progress[arguments.variable] = null;
        reply = arguments.variable + ' and progress of ' + arguments.variable + ' have been deleted.';
    }
    else {
        reply = arguments.variable + ' is not defined.';
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['variable'],
        description: 'Unset the value of the given variable or progress variable ' +
                     ' and delete it from the conversation.'
    },
    {
        arguments: ['variable', 'type'],
        description: 'Unset the value of the variable of the given type, either ' +
                     '"variable" or "progress", and delete it from the conversation.'
    }
];


module.exports = function init() {
    return {
        name: 'delete',
        func: _delete,
        usage: usage
    }
};
