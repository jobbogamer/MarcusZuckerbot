// Main component of Zuckerbot. The server is the 'brains' behind the whole
// thing – this component performs the connection to Facebook and collects
// messages before sending them off to be matched and acted on.

// npm modules
var login = require('facebook-chat-api');
var Firebase = require('firebase');
var log = require('npmlog');

// Local modules
var messageHandler = require('./messageHandler');

// Will store a copy of the facebook chat API once the bot logs in.
var facebookAPI = null;
var allData = null;



// Web server to keep openshift quiet
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// Use body-parser to read requests to /notify.
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    // The server is listening.
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/notify', function(req, res) {
    console.log('Received a deployment notification.');
    
    // Send an empty response.
    res.send('');
    res.end();

    // Notify any conversations about the deployment status.
    notifyAboutDeployment(req.body);
});




// Print current version of the app.
var pkg = require('./package.json');
console.log('Zuckerbot v' + pkg.version + '\n');

if (process.env.ZB_DEV_MODE) {
    log.warn('Dev Mode is currently enabled.', 'Replies will not be sent in this mode.');
    console.log('');
}

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

    // Notify subscribed chats that Zuckerbot is running, as long as it is not
    // running in dev mode.
    if (!process.env.ZB_DEV_MODE) {
        var message = {
            body: 'Zuckerbot is now running v' + pkg.version + '.'
        };

        Object.keys(chats).forEach(function(key) {
            // By default, do not notify.
            var chatData = chats[key] || {
                notifications: false
            };

            if (chatData.notifications) {
                facebookAPI.sendMessage(message, key);
            }
        });
    }

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

                    // Send the reply, but only if the bot is not running in
                    // dev mode.
                    if (!process.env.ZB_DEV_MODE) {
                        api.sendMessage(message, event.threadID);
                    }
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


// Send messages to subscribed conversations that a deployment is about to
// occur.
function notifyAboutDeployment(payload) {
    // Notifications should only be sent about the master branch.
    if (payload.branch !== 'master') {
        return;
    }

    var message = {
        body: 'Zuckerbot is about to be restarted to deploy an update. This will ' +
              'take a couple of minutes.'
    };

    // This may be a notification of failure.
    if (payload.status_message != null) {
        console.log('Status message: ' + payload.status_message);
        var status = payload.status_message.toLowerCase();

        if (status === 'broken' ||
            status === 'failed' ||
            status === 'still failing') {
            message = {
                body: 'Deployment failed. Zuckerbot will continue running.'
            };
        }
    }
    else {
        console.log('Notification does not contain a status message.');
    }

    // Loop through each chat and see if it's subscribed to notifications.
    Object.keys(allData).forEach(function(key) {
        // By default, do not notify.
        var chatData = allData[key] || {
            notifications: false
        };

        if (chatData.notifications) {
            facebookAPI.sendMessage(message, key);
        }
    });
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
        facebookAPI = api;
        allData = data.chats;
        startBot(api, data.chats);
    });
});
