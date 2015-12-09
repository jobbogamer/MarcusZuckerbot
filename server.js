// Main component of Zuckerbot. The server is the 'brains' behind the whole
// thing – this component performs the connection to Facebook and collects
// messages before sending them off to be matched and acted on.

// npm modules
var login = require('facebook-chat-api');
var Firebase = require('firebase');

// Local modules
var messageHandler = require('./messageHandler');


// Web server to keep openshift quiet
var http = include('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("");
}).listen(process.env.PORT || 8080);



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
            if (event.body.length > 0) {
                console.log('   ', event.body);
            }
            if (event.attachments && event.attachments.length > 0) {
                console.log('    [Attachment]');
            }

            // Mark the message as read.
            api.markAsRead(event.threadID);

            // Load the chat's data from the database.
            var chat = chats[event.threadID] || {
                variables: {},
                progress: {}
            };

            var callback = function(message, chat) {
                // If the messageHandler sent back a reply, send it to the chat.
                if (message) {
                    console.log('Sending reply:');
                    if (message.body.length > 0) {
                        console.log('   ', message.body.replace(/\n/g, '\n    '));
                    }
                    if (message.attachment) {
                        console.log('    [Attachment]');
                    }

                    api.sendMessage(message, event.threadID);
                }
                else {
                    console.log('No reply required.')
                }

                if (chat) {
                    chats[event.threadID] = chat;
                    chatsDB.set(chats);
                }

                console.log('Finished processing message.', '\n');
            }

            // Send the received message to the message handler.
            messageHandler.handle(event, chat, api, callback);
        }
    });
    console.log('Zuckerbot is now listening for messages.\n');
}





// "Main program"

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
        startBot(api, data.chats);
    });
});
