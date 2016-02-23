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
var chatsData = null;

// The old version of facebook api functions that have been overriden.
var sendMessageOld = null;
var sendTypingIndicatorOld = null;

// The previous version of Zuckerbot.
var previousVersion = null;



// Web server to keep openshift quiet
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

// Use body-parser to read requests to /notify.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    // The server is listening.
});

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/send', function(req, res) {
    console.log('Received a request to send a message.');

    // Send an empty response.
    res.send('');
    res.end();

    // Pass off the request to get sent.
    sendPostedMessage(req.body);
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

// Load the command plugins.
console.log('Loading command plugins...');
messageHandler.loadPlugins();
console.log('Done.\n');

// Load the regex commands.
console.log('Loading regex plugins...');
messageHandler.loadRegexPlugins();
console.log('Done.\n');

// Connect to the Firebase database.
console.log('Connecting to Firebase...');
var db = new Firebase(process.env.FIREBASE);
console.log('Done.\n');

// Load sub-databases.
var chatsDB = db.child('chats');




// Functions

// Override of the sendMessage function in the Facebook Chat API, which doesn't
// actually send the message if dev mode is enabled.
var sendMessageIfNotDev = function(message, threadID, callback) {
    console.log('Sending message:');
    if (message.body != null && message.body.length > 0) {
        console.log('   ', message.body.replace(/\n/g, '\n    '));
    }
    if (message.attachment) {
        console.log('    [Attachment]');
    }
    if (message.sticker) {
        console.log('    [Sticker ' + message.sticker + ']');
    }

    // Don't send the message if dev mode is enabled.
    if (process.env.ZB_DEV_MODE) {
        console.log('(Not sent)\n');
        if (callback) {
            callback(null, null);
        }
        return;
    }

    // Pass the message straight through to the actual API call.
    sendMessageOld(message, threadID, callback);
}


// Override of the sendTypingIndicator function in the facebook chat api. This
// version doesn't do anything if ZB_DISABLE_TYPING_INDICATOR is set.
var sendTypingIndicatorIfNotDisabled = function(threadID, callback) {
    if (process.env.ZB_DISABLE_TYPING_INDICATOR) {
        if (callback) {
            callback(null, null);
        }

        // Return a function which does nothing when called.
        return function() {};
    }

    // Pass the call through to the real function.
    return sendTypingIndicatorOld(threadID, callback);
}


// Start listening to incoming events.
function startBot(api, chats) {
    // Set a default value for chats in case it doesn't already exist.
    // Firebase won't save an empty object to the database.
    chats = chats || {};

    if (!process.env.ZB_NO_NOTIFY) {
        // Notify subscribed chats that Zuckerbot is running. If a different version
        // is running, modify the text slightly.
        var body = '';
        if (pkg.version !== previousVersion) {
            body = 'Zuckerbot has been updated to v' + pkg.version + '.';

            // Store the new version of the bot, as long as dev mode is not enabled.
            if (!process.env.ZB_DEV_MODE) {
                db.child('version').set(pkg.version);
            }
        }
        else {
            body = 'Zuckerbot has been restarted.';
        }
        var message = {
            body: body
        };

        Object.keys(chats).forEach(function(key) {
            // By default, do not notify each chat.
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
                event.attachments.forEach(function(attachment) {
                    if (attachment.type === 'sticker') {
                        console.log('    [Sticker ' + attachment.stickerID + ']');
                    }
                    else {
                        console.log('    [Attachment]');
                    }
                });
            }
            console.log('');

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
                    // Send the reply.
                    api.sendMessage(message, event.threadID);
                }
                else {
                    console.log('No reply required.\n')
                }

                if (chat) {
                    chats[event.threadID] = chat;
                    chatsDB.set(chats);
                }
            }

            // Send the received message to the message handler.
            messageHandler.handle(event, chat, api, callback);
        }
    });
    console.log('Zuckerbot is now listening for messages.\n');
}


function sendPostedMessage(payload) {
    console.log(payload);

    if (payload.thread_ids == null) {
        console.log('Payload does not contain thread_ids.\n');
        return;
    }

    if (payload.body == null) {
        console.log('Payload does not contain body.\n');
        return;
    }

    console.log('Thread IDs:' + '\n    ' + payload.thread_ids.join(', '));
    console.log('Message:' + '\n    ' + payload.body);
    if (payload.attachment) {
        console.log('    [Attachment]');
    }
    if (payload.sticker) {
        console.log('    [Sticker]');
    }
    console.log('');

    var message = {
        body: payload.body,
        attachment: payload.attachment,
        sticker: payload.sticker
    }

    payload.thread_ids.forEach(function (threadID) {
        facebookAPI.sendMessage(message, threadID);
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

        // Override the sendMessage function with a custom implementation.
        sendMessageOld = api.sendMessage;
        api.sendMessage = sendMessageIfNotDev;

        // Override sendTypingIndicator too.
        sendTypingIndicatorOld = api.sendTypingIndicator;
        api.sendTypingIndicator = sendTypingIndicatorIfNotDisabled;

        // Read the previous version of the bot.
        previousVersion = data.version;

        console.log('Done.\n');
        facebookAPI = api;
        chatsData = data.chats;
        startBot(api, data.chats);
    });
});
