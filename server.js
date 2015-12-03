// Main component of Zuckerbot. The server is the 'brains' behind the whole
// thing – this component performs the connection to Facebook and collects
// messages before sending them off to be matched and acted on.

// npm modules
var login = require('facebook-chat-api');
var Firebase = require('firebase');

// Local modules
var messageHandler = require('./messageHandler');





// Functions

// Start listening to incoming events.
function startBot(api, chats) {
    // Set a default value for chats in case it doesn't already exist.
    // Firebase won't save an empty object to the database.
    chats = chats || {};

    var stopListening = api.listen(function receive(err, event) {
        if (err) {
            return console.error(err);
        }

        if (event.type === 'message') {
            console.log('Message received:');
            console.log('   ', event.body);

            // Load the chat's data from the database.
            var chat = chats[event.threadID];

            // Send the received message to the message handler.
            var reply = messageHandler.handle(event.body, chat);

            // If the messageHandler sent back a reply, send it to the chat.
            if (reply) {
                console.log('Sending reply:');
                console.log('   ', reply);
                api.sendMessage(reply, event.threadID);
            }
            else {
                console.log('No reply required.')
            }

            console.log('Finished processing message.', '\n');
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

// Load sub-databases.
var chatsDB = db.child('chats');

// Load data from the database and log in to facebook when it's done.
console.log('Loading data from the database...');
db.once('value', function dataReceived(snapshot) {
    // If there is no data returned, default to an empty dict.
    var data = snapshot.val() || {};
    console.log('Done.', '\n');

    // Use the stored credentials, and set the log level of the facebook
    // chat module so it doesn't write so much to the log.
    var credentials = {
        email: process.env.FB_EMAIL,
        password: process.env.FB_PASSWORD
    };
    var options = {
        logLevel: "warn"
    };

    // Connect to facebook chat, calling startBot if successful. The
    // data retrieved from the database is passed into startBot so it
    // can use it.
    console.log('Logging in to Facebook chat...');
    login(credentials, options, function loggedIn(err, api) {
        if (err) {
            return console.error(err);
        }

        console.log('Done.\n');
        startBot(api, data);
    });
});
