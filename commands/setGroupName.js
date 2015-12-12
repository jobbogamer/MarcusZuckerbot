// Set the name of the current conversation. Only works for group conversations.

var setGroupName = function(arguments, info, replyCallback) {
    var threadID = info.threadID;
    var api = info.facebookAPI;
    var newName = arguments.name;

    api.setTitle(newName, threadID, function setNameFinished(err, res) {
        if (err) {
            replyCallback({
                body: 'An error occurred when setting the group name.'
            });
        }
        else {
            replyCallback({
                body: 'The group name has been changed to ' + newName + '.'
            });
        }
    });
}

var usage = [
    {
        arguments: ['name'],
        description: 'Set the name of the group. This only works in ' + 
                     'group conversations.'
    }
];


module.exports = function init() {
    return {
        name: 'setGroupName',
        func: setGroupName,
        usage: usage
    }
};
