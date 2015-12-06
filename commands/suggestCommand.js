// suggestCommand allows someone to suggest a new Zuckerbot command, which gets
// submitted as an issue to the Zuckerbot GitHub repo.
// Requires GITHUB_USER and GITHUB_PASSWORD to be set in the environment variables.

// Includes the createIssue() function used to create a new GitHub issue.
var githubIssues = require('../third_party_apis/githubIssues.js');


var suggestCommand = function(arguments, info, replyCallback) {
    var title = arguments.name + '()';
    var body = arguments.description + '\n\n' + 'Suggested by ' + info.sender + '.';

    githubIssues.createIssue(title, body, function(err, res) {
        if (err) {
            reply({
                body: 'An error occurred when trying to submit the suggestion.'
            });
            return;
        }

        var url = res.html_url;
        var name = res.title.substr(0, res.title.length - 2);

        replyCallback({
            body: 'Command \'' + name + '\' has been suggested.\n\n' + url
        });
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
