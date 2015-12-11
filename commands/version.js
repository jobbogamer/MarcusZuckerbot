// Display the current version number of Zuckerbot.

var version = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = '';

    // Get the version number from package.json.
    var pkg = require('../package.json');
    reply = 'Zuckerbot is currently running v' + pkg.version + '.';

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}

var usage = [
    {
        arguments: [],
        description: 'Display the currently running version of Zuckerbot.'
    }
];


module.exports = function init() {
    return {
        name: 'version',
        func: version,
        usage: usage
    }
};
