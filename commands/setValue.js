// Set the value of a local variable in the conversation and display its value.

var setValue = function(arguments, info, replyCallback) {
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
            reply = 'Error: Argument 2 of setValue() should be a number or an existing variable name.';
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
        description: 'Set the value of the given variable, and display confirmation.'
    }
];


module.exports = function init() {
    return {
        name: 'setValue',
        func: setValue,
        usage: usage
    }
};
