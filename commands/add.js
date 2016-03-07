// Add a value to an existing variable.

var add = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = 'Hello, world!';

    // Use an empty object as the default if no variables are defined.
    chatData.variables = chatData.variables || {};

    if (chatData.variables[arguments.variable] == null) {
        reply = arguments.variable + ' is not defined.';
    }
    else {
        // Try to convert the value to a number.
        var valueFloat = parseFloat(arguments.value);

        // If the value isn't a number, assume it's the name of another variable.
        if (isNaN(valueFloat)) {
            // See if the other variable exists.
            var otherVariable = chatData.variables[arguments.value];
            if (otherVariable != null) {
                var newValue = chatData.variables[arguments.variable] + otherVariable;
                chatData.variables[arguments.variable] = newValue;
                reply = arguments.variable + ' is now set to ' + newValue + '.';
            }
            else {
                reply = arguments.value + ' is not defined.';
            }
        }
        else {
            var newValue = chatData.variables[arguments.variable] + valueFloat;
            chatData.variables[arguments.variable] = newValue;
            reply = arguments.variable + ' is now set to ' + newValue + '.';
        }
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['variable', 'value'],
        description: 'Add a value to the given variable.'
    }
];


module.exports = function init() {
    return {
        name: 'add',
        func: add,
        usage: usage
    }
};
