// Subtract a value to an existing variable.

var helpers = require('../helpers');


var subtract = function(arguments, info, replyCallback) {
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

        var oldValue = chatData.variables[arguments.variable];
        var newValue = null;

        // If the value isn't a number, assume it's the name of another variable.
        if (isNaN(valueFloat)) {
            // See if the other variable exists.
            var otherVariable = chatData.variables[arguments.value];
            if (otherVariable != null) {
                newValue = oldValue - otherVariable;
                valueFloat = otherVariable;
            }
            else {
                reply = arguments.value + ' is not defined.';
            }
        }
        else {
            newValue = oldValue - valueFloat;
        }
    }

    if (newValue != null) {
        // Floating point means that sometimes decimals won't exactly equal
        // what we expect. In that case, we need to choose a number of
        // decimal places to round to. Luckily, since we only support
        // addition and subtraction, the answer is easy:
        // The answer can only have less than or equal to the largest number
        // of decimal places in the two operands. So we just see what the
        // largest number of decimal places is, and round to that number.
        var maxDecimals = Math.max(helpers.countDecimalPlaces(oldValue), helpers.countDecimalPlaces(valueFloat));
        var displayValue = helpers.round(newValue, maxDecimals);

        chatData.variables[arguments.variable] = newValue;
        reply = arguments.variable + ' is now set to ' + displayValue + '.';
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['variable', 'value'],
        description: 'Subtract a value from the given variable.'
    }
];


module.exports = function init() {
    return {
        name: 'subtract',
        func: subtract,
        usage: usage
    }
};
