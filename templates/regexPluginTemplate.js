// Describe your plugin here.

var COMMAND_NAME = function(matches, info, replyCallback) {
    var chatData = info.chatData;
    var reply = 'Hello, world!';

    // Your implementation here...

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}


module.exports = function init() {
    return {
        name: 'COMMAND_NAME',
        func: COMMAND_NAME,
        pattern: /hello,?\s+world/gi
    }
};
