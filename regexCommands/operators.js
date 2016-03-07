// Alternative syntax for zb.add() and zb.subtract().

var operators = function(matches, info, replyCallback) {
    var reply = '';

    var chatData = info.chatData;
    chatData.variables = chatData.variables || {};
    
    matches.forEach(function(match) {
        // Get the variable name from capture group 1, then get that variable's
        // value from chatData.
        var variable = match[1];
        var value = chatData.variables[variable];
        
        if (value == null) {
            reply += variable + ' is not defined.\n';
            return;
        }

        // Get the operator from either capture group 2 or 3.
        var operator = (match[2] != null) ? match[2] : match[3];

        // Get the operand from capture group 4 and convert it to a number.
        var operand = parseFloat(match[4]);

        // Apply the operator to the variable.
        var newValue = null;
        switch (operator) {
            case '++':
                newValue = value + 1;
                break;

            case '--':
                newValue = value - 1;
                break;

            case '+=':
                newValue = value + operand;
                break;

            case '-=':
                newValue = value - operand;
                break;

            case '=':
                newValue = operand;
                break;
        }

        // Store the new value of the variable.
        chatData.variables[variable] = newValue;

        // Display the new value.
        reply += variable + ' is now set to ' + newValue + '.\n';
    });

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}


module.exports = function init() {
    return {
        name: 'operators',
        func: operators,
        pattern: /zb.([a-z_][a-z0-9_]*)(?:(\+\+|--)|\s(\+=|-=|=)\s(-?\d+))/gi
    }
};
