// Delete a variable from the conversation.

var deleteVariable = function(arguments, info, replyCallback) {
    var reply = '';
    var chatData = info.chatData;
    
    // Default to an empty object in case no variables are set.
    chatData.variables = chatData.variables || {};

    var variable = chatData.variables[arguments.variable];

    if (variable != null) {
        chatData.variables[arguments.variable] = null;
        reply = arguments.variable + ' has been deleted.';
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
        description: 'Unset the value of given variable and delete it from the conversation.'
    }
];


module.exports = function init() {
    return {
        name: 'deleteVariable',
        func: deleteVariable,
        usage: usage
    }
};
