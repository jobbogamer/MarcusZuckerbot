// Subtract one from the value of a variable.

var decrement = function(arguments, info, replyCallback) {
    var reply = '';
    var chatData = info.chatData;

    // Default to an empty variable in case no variables exist.
    chatData.variables = chatData.variables || {};

    var value = chatData.variables[arguments.variable];
    if (value != null) {
        var newValue = value - 1;
        chatData.variables[arguments.variable] = newValue;
        reply = arguments.variable + ' is now set to ' + newValue + '.';
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
        description: 'Subtract one from the given variable.'
    }
];


module.exports = function init() {
    return {
        name: 'decrement',
        func: decrement,
        usage: usage
    }
};
