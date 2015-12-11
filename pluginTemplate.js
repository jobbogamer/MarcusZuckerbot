// Describe your plugin here.

var COMMAND_NAME = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = 'Hello, world!';

    // Your implementation here...

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: [],
        description: 'Describe your command here.'
    }
];


module.exports = function init() {
    return {
        name: 'COMMAND_NAME',
        func: COMMAND_NAME,
        usage: usage
    }
};
