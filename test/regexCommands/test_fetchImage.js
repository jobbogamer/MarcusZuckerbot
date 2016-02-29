
var init = require('../../regexCommands/fetchImage');
var should = require('should');


describe('fetchImage', function() {
    describe('match', function() {
        var command = init();
        var regex = new RegExp(command.pattern);

        it('should match basic image URLs', function() {
            var matches = null;

            matches = 'http://imgur.com/abcdef.jpg'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/xyz123.png'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/q_r_s_t.gif'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/path/to/images/deadbeef.png'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);
        });


        it('should match https URLs', function() {
            var matches = null;

            matches = 'https://imgur.com/abcdef.jpg'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://imgur.com/xyz123.png'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://imgur.com/q_r_s_t.gif'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://www.imgur.com/abcdef.jpg'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

        });


        it('should match image URLs with query parameters', function() {
            var matches = null;

            matches = 'http://imgur.com/abcdef.jpg?size=500'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/xyz123.png?colour=red'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/q_r_s_t.gif?frame_skip=false&size=100'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://www.imgur.com/abcdef.jpeg?reverse=1'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

        });


        it('should match URLs with weird TLDs', function() {
            var matches = null;

            matches = 'http://images.photography/1.jpg'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://concrete.builders/portfolio/skyscraper.png'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'https://fluffy.dog/photo.jpg?size=500'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

        });


        it('should match messages with URLs and text', function() {
            var matches = null;

            matches = 'Look at this cool photo: http://imgur.com/abcdef.jpg'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'http://imgur.com/xyz123.png is really good'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

            matches = 'Do you think http://imgur.com/q_r_s_t.gif is appropriate?'.match(regex);
            should.exist(matches);
            matches.should.have.length(1);

        });


        it('should match multiple URLs in the same message', function() {
            var matches = null;

            var matches = 'http://imgur.com/abcdef.jpg http://imgur.com/xyz123.png'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);

            matches = 'Is http://imgur.com/xyz123.png or http://imgur.com/q_r_s_t.gif better?'.match(regex);
            should.exist(matches);
            matches.should.have.length(2);
        });


        it('should not match gifv URLs', function() {
            var matches = null;

            matches = 'http://imgur.com/abcdef.gifv'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://imgur.com/xyz123.gifv'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://www.imgur.com/abcdef.gifv?reverse=1'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'https://concrete.builders/portfolio/skyscraper.gifv'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });


        it('should not match non-image URLs', function() {
            var matches = null;

            matches = 'http://facebook.com/somepage'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://imgur.com/a1b2c3/'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://google.co.uk/jpg_images.html'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http://cake.gif'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });


        it('should not match messages with no URL', function() {
            var matches = null;

            matches = 'This is a message that has no URL'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }

            matches = 'http:not.a.url.com/images/jpg'.match(regex);
            if (matches) {
                matches.should.have.length(0);
            }
        });
    });


    describe('execute', function() {
        // Allow longer than usual for the tests because they access the web.
        this.timeout(10000);
        this.slow(5000);

        
        it('should fetch an image', function(done) {
            var command = init();

            var matches = ['http://i.giphy.com/JIX9t2j0ZTN9S.gif'];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                if (reply.body) {
                    reply.body.should.be.String();
                    reply.body.should.have.length(0);
                }

                // There should be an image attached to the message.
                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();

                done();
            });
        });


        it('should fetch an image using https', function(done) {
            var command = init();

            var matches = ['https://i.giphy.com/JIX9t2j0ZTN9S.gif'];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                if (reply.body) {
                    reply.body.should.be.String();
                    reply.body.should.have.length(0);
                }

                // There should be an image attached to the message.
                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();
                
                done();
            });
        });


        it('should fetch multiple images', function(done) {
            var command = init();

            var matches = [
                'https://i.giphy.com/JIX9t2j0ZTN9S.gif',
                'http://i.giphy.com/freTElrZl4zaU.gif'
            ];

            var messagesReceived = 0;

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                if (reply.body) {
                    reply.body.should.be.String();
                    reply.body.should.have.length(0);
                }

                // There should be an image attached to the message.
                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();

                // Expect to receive two messages, because two images were
                // matched.
                messagesReceived++;
                if (messagesReceived == 2) {
                    done();
                }
            });
        });


        it('should not send an image when facebook attaches it', function(done) {
            var command = init();

            var matches = ['https://i.giphy.com/JIX9t2j0ZTN9S.gif'];

            var info = {
                attachments: [
                    {
                        type: 'share',
                        url: 'https://i.giphy.com/JIX9t2j0ZTN9S.gif'
                    }
                ]
            }

            command.func(matches, info, function replyCallback(reply, chat) {
                should.not.exist(reply);               

                done();
            });
        });


        it('should send images even when the first one is attached', function(done) {
            var command = init();

            var matches = [
                'https://i.giphy.com/JIX9t2j0ZTN9S.gif',
                'http://i.giphy.com/freTElrZl4zaU.gif'
            ];

            var info = {
                attachments: [
                    {
                        type: 'share',
                        url: 'https://i.giphy.com/JIX9t2j0ZTN9S.gif'
                    }
                ]
            }

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                if (reply.body) {
                    reply.body.should.be.String();
                    reply.body.should.have.length(0);
                }

                // There should be an image attached to the message. Facebook
                // will only attach the first image to the message, so fetchImage
                // should fetch the second one.
                reply.should.have.property('attachment');
                reply.attachment.should.be.Object();
                
                done();
            });
        });


        it('should handle errors gracefully', function(done) {
            var command = init();

            var matches = ['http://i.giphy.com/this_image_doesnt_exist.gif'];

            command.func(matches, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                if (reply.body) {
                    reply.body.should.be.String();
                    reply.body.should.not.have.length(0);
                }

                // There should not be an image attached to the message.
                reply.should.not.have.property('attachment');                

                done();
            });
        });
    });
});
