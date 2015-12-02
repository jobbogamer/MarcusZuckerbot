// Main component of Zuckerbot. The server is the 'brains' behind the whole
// thing – this component performs the connection to Facebook and collects
// messages before sending them off to be matched and acted on.

// npm modules
var login = require('facebook-chat-api');
var Firebase = require('firebase');


// Make Azure actually do things maybe
var http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(process.env.PORT || 5000);


// Functions

// Start listening to incoming events.
function startBot(api) {
    var stopListening = api.listen(function receive(err, event) {
        if (err) {
            return console.error(err);
        }

        if (event.type === 'message') {
            console.log('Message received:');
            console.log('   ', event.body, '\n');

            // Simply echo back the message.
            api.sendMessage(event.body, event.threadID);
        }
    });
    console.log('Zuckerbot is now listening for messages.\n');
}




// "Main program"

// Print current version of the app.
var pkg = require('./package.json');
console.log('Zuckerbot v' + pkg.version + '\n');

// Check that the environment variables are set.
if (!process.env.FIREBASE) {
    return console.error('FIREBASE environment variable is not set.');
}
if (!process.env.FB_EMAIL) {
    return console.error('FB_EMAIL environment variable is not set.');
}
if (!process.env.FB_PASSWORD) {
    return console.error('FB_PASSWORD environment variable is not set.');
}

// Connect to the Firebase database.
console.log('Connecting to Firebase...');
var db = new Firebase(process.env.FIREBASE);
console.log('Done.\n');

// Connect to Facebook chat.
console.log('Connecting to Facebook chat...');
login({
    email: process.env.FB_EMAIL,
    password: process.env.FB_PASSWORD
},
{
    logLevel: "warn"
}, function loggedIn(err, api) {
    if (err) {
        return console.error(err);
    }

    console.log('Done.\n');
    startBot(api);
});
