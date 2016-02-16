
var test = function(arguments, info, replyCallback) {
    var chatData = info.chatData;
    var reply = '';

    // Get the version number from package.json.
    var pkg = require('../package.json');
    reply = 'Hello, world!';

    var message = {
        body: reply
    };

    replyCallback(message, chatData);
}


module.exports = function init() {
    return {
    	name: 'versionRegex',
        pattern: /hello,? world/gi,
        func: test
    }
};
