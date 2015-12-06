// suggestCommand allows someone to suggest a new Zuckerbot command, which gets
// submitted as an issue to the Zuckerbot GitHub repo.
// Requires GITHUB_USER and GITHUB_PASSWORD to be set in the environment variables.

// Includes the createIssue() function used to create a new GitHub issue.
var githubIssues = require('../third_party_apis/githubIssues.js');


var suggestCommand = function(arguments, info, replyCallback) {
    replyCallback({
        body: 'name = ' + arguments.name + '\n' + 'description = ' + arguments.description
    });
}

var usage = [
    {
        arguments: ['name', 'description'],
        description: 'Open a GitHub issue in the Zuckerbot repo suggesting a new command with ' + 
                     'the given name and description.'
    }
];


module.exports = function init() {
    if (!process.env.GITHUB_USER) {
        return {
            error: 'GITHUB_USER environment variable is not set.'
        };
    }

    if (!process.env.GITHUB_PASSWORD) {
        return {
            error: 'GITHUB_PASSWORD environment variable is not set.'
        };
    }

    return {
        name: 'suggestCommand',
        func: suggestCommand,
        usage: usage
    };
}
