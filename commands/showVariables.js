// List all defined variables for the current conversation.

var showVariables = function(arguments, info, replyCallback) {
    var reply = '';

    // Default to an empty object in case no variables are defined.
    var variables = info.chatData.variables || {};

    var keys = Object.keys(variables);
    keys.forEach(function(key) {
        if (variables[key] != null) {
            reply += key + ' = ' + variables[key] + '\n';
        }
    });

    if (reply.length == 0) {
        reply = 'No variables are defined.';
    }

    replyCallback({
        body: reply
    });
}

var usage = [
    {
        arguments: [],
        description: 'List every defined variable and its current value.'
    }
];


module.exports = function init() {
    return {
        name: 'showVariables',
        func: showVariables,
        usage: usage
    }
}
