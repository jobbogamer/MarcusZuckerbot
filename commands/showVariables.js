// List all defined variables for the current conversation.

var helpers = require('../helpers');

var showVariables = function(arguments, info, replyCallback) {
    var reply = '';

    // Default to an empty object in case no variables are defined.
    var variables = info.chatData.variables || {};
    var progressVariables = info.chatData.progress || {};

    var variableList = '';
    var progressList = '';

    // Iterate over all variables.
    var keys = Object.keys(variables);
    keys.forEach(function(key) {
        if (variables[key] != null) {
            variableList += key + ' = ' + variables[key] + '\n';
        }
    });

    // Iterate over all progress variables.
    var keys = Object.keys(progressVariables);
    keys.forEach(function(key) {
        if (progressVariables[key] != null) {
            progressList += key + ' = ' + helpers.round(progressVariables[key]) + '\n';
        }
    });

    // Check that variables are actually defined, by seeing if any were added to
    // the lists.
    if (variableList.length == 0) {
        variableList = 'No variables are defined.';
    }
    if (progressList.length == 0) {
        progressList = 'No progress variables are defined.';
    }

    replyCallback({
        body: 'Variables:\n' + variableList + '\nProgress Variables:\n' + progressList
    });
}

var usage = [
    {
        arguments: [],
        description: 'List every defined variable and its current value.'
    }
];


module.exports = function init() {
    return {
        name: 'showVariables',
        func: showVariables,
        usage: usage
    }
}
