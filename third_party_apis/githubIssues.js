// Create GitHub issues on the MarcusZuckerbot repo.

var GitHub = require('github');


var user = 'jobbogamer';
var repo = 'MarcusZuckerbot';


var createIssue = function(title, body, labels, callback) {
    var github = new GitHub({
        version: "3.0.0",
        protocol: "https",
        timeout: 5000,
        headers: {
            "user-agent": "MarcusZuckerbot"
        }
    });
    github.authenticate({
        type: "basic",
        username: process.env.GITHUB_USER,
        password: process.env.GITHUB_PASSWORD
    });

    var options = {
        user: user,
        repo: repo,
        title: title,
        body: body,
        labels: labels
    };

    github.issues.create(options, function issueCreated(err, res) {
        callback(err, res);
    });
}


module.exports = {
    createIssue: createIssue
};
