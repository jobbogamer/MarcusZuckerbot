// Set the value of a local variable in the conversation and display its value.

var set = function(arguments, info, replyCallback) {
    var chatData = info.chatData;

    // Default to an empty object if no variables exist yet.
    chatData.variables = chatData.variables || {}

    var reply = '';

    // Try to convert the value to a number.
    var valueFloat = parseFloat(arguments.value);
    if (isNaN(valueFloat)) {
        // See if the value passed in is the name of another variable, and use
        // that instead.
        var otherVariable = chatData.variables[arguments.value]

        if (otherVariable != null) {
            chatData.variables[arguments.variable] = otherVariable;
            reply = arguments.variable + ' has been set to ' + otherVariable + '.';
        }
        else {
            reply = arguments.value + ' is not defined.';
        }
    }
    else {
        chatData.variables[arguments.variable] = valueFloat;
        reply = arguments.variable + ' has been set to ' + valueFloat + '.';
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['variable', 'value'],
        description: 'Set the value of the given variable, or create a new variable ' +
                      'with that name if it doesn\'t already exist.'
    }
];


module.exports = function init() {
    return {
        name: 'set',
        func: set,
        usage: usage
    }
};
