
var init = require('../../commands/setNotificationsEnabled');
var command = init();

describe('setNotificationsEnabled', function() {
    describe('execute', function() {
        it('should turn on notifications when the argument is true', function(done) {
            // Set the 'setting' argument to true.
            var arguments = {
                setting: 'true'
            };

            // Create a chat info object where notifications are turned off.
            var chatData = {
                notifications: false
            };

            // Put the chatData into an info object.
            var info = {
                chatData: chatData
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The command should reply with a message saying that
                // notifications have been enabled.
                reply.should.be.Object();
                reply.should.have.property('body');

                // The reply should be helpful. It should say something about
                // 'notifications' being turned 'on' or 'enabled'.
                reply.body.should.match(/notifications/gi);
                reply.body.should.match(/(on)|(enabled)/gi);

                // Notifications should have actually been enabled.
                chat.should.be.Object();
                chat.should.have.property('notifications');
                chat.notifications.should.be.true();

                done();
            });
        });


        it('should turn off notifications when the argument is false', function(done) {
            // Set the 'setting' argument to false.
            var arguments = {
                setting: 'false'
            };

            // Create a chat info object where notifications are turned on.
            var chatData = {
                notifications: true
            };

            // Put the chatData into an info object.
            var info = {
                chatData: chatData
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The command should reply with a message saying that
                // notifications have been disabled.
                reply.should.be.Object();
                reply.should.have.property('body');

                // The reply should be helpful. It should say something about
                // 'notifications' being turned 'off' or 'disabled'.
                reply.body.should.match(/notifications/gi);
                reply.body.should.match(/(off)|(disabled)/gi);

                // Notifications should have actually been disabled.
                chat.should.Object();
                chat.should.have.property('notifications');
                chat.notifications.should.be.false();

                done();
            });
        });


        it('should not fail if notifications are already turned on', function(done) {
            // Set the 'setting' argument to true.
            var arguments = {
                setting: 'true'
            };

            // Create a chat info object where notifications are turned on.
            var chatData = {
                notifications: true
            };

            // Put the chatData into an info object.
            var info = {
                chatData: chatData
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The command should reply with a message saying that
                // notifications are enabled.
                reply.should.be.Object();
                reply.should.have.property('body');

                // The reply should be helpful. It should say something about
                // 'notifications' being turned 'on' or 'enabled'.
                reply.body.should.match(/notifications/gi);
                reply.body.should.match(/(on)|(enabled)/gi);

                // Notifications should still be enabled.
                chat.should.Object();
                chat.should.have.property('notifications');
                chat.notifications.should.be.true();

                done();
            });
        });
    });
});
