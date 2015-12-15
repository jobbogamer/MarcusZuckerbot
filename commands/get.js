// Display the value of a variable.

var get = function(arguments, info, replyCallback) {
    var reply = '';

    var value = info.chatData.variables[arguments.variable];
    if (value != null) {
        reply = arguments.variable + ' is currently set to ' + value + '.';
    }
    else {
        reply = arguments.variable + ' is not defined.';
    }

    replyCallback({
        body: reply
    });
}

var usage = [
    {
        arguments: ['variable'],
        description: 'Display the current value of the given variable.'
    }
];


module.exports = function init() {
    return {
        name: 'get',
        func: get,
        usage: usage
    }
};
