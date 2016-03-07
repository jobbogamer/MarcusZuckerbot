// Turn deployment notifications on or off for the current conversation.

var setNotificationsEnabled = function(arguments, info, replyCallback) {
    // Default to an empty object if this is a new chat.
    var chatData = info.chatData || {};
    var reply = '';

    if (arguments.setting === 'true') {
        if (chatData.notifications) {
            reply = 'Deployment notifications are already on for this conversation.'
        }
        else {
            chatData.notifications = true;
            reply = 'Deployment notifications have been turned on for this conversation.'
        }
    }
    else {
        if (!chatData.notifications) {
            reply = 'Deployment notifications are already off for this conversation.'
        }
        else {
            chatData.notifications = false;
            reply = 'Deployment notifications have been turned off for this conversation.'
        }
    }

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: ['setting'],
        description: 'Turn deployment notifications on or off. Set \'setting\' to true ' + 
                     'to turn them on, or false to turn them off.'
    }
];


module.exports = function init() {
    return {
        name: 'setNotificationsEnabled',
        func: setNotificationsEnabled,
        usage: usage
    }
};
