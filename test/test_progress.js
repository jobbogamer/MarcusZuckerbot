
var should = require('should');
var init = require('../commands/progress');

var command = init();


describe('progress', function() {
    describe('create', function() {
        it('should create a new progress with an implicit target', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': 62
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/62/g);
                reply.body.should.match(/100/g);
                reply.body.should.match(/62%/g);
                reply.body.should.match(/▕██████▏▏▏▏▏/g);

                // The chat data should now have a progress object, which
                // should contain the new progress variable having set the
                // target to 100 implicitly.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(62);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(100);

                done();
            });
        });


        it('should create a new progress with a given target', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': 84,
                'target': 200
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/84/g);
                reply.body.should.match(/200/g);
                reply.body.should.match(/42%/g);
                reply.body.should.match(/▕████▏▏▏▏▏▏▏/g);

                // The chat data should now have a progress object, which
                // should contain the new progress variable having set the
                // target to 200.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(84);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(200);

                done();
            });
        });


        it('should error when value is greater than target', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': 73,
                'target': 50
            };

            var info = {
                chatData: {
                    progress: {}
                }
            }

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/value.+((less)|(smaller)) than or equal to target/gi);

                // There should be no image attached.
                if (reply.attachment) {
                    should(reply.attachment).be.null();
                }

                // The progress should not have been created.
                chat.progress.should.not.have.property('nuggets');

                done();
            });
        });


        it('should error when value is negative', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': -7
            };

            var info = {
                chatData: {
                    progress: {}
                }
            }

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/value.+((not be negative)|(greater than or equal to zero))/gi);

                // There should be no image attached.
                if (reply.attachment) {
                    should(reply.attachment).be.null();
                }

                // The progress should not have been created.
                chat.progress.should.not.have.property('nuggets');

                done();
            });
        });


        it('should error when target is zero', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': 0,
                'target': 0
            };

            var info = {
                chatData: {
                    progress: {}
                }
            }

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/target.+greater than (zero|0)/gi);

                // There should be no image attached.
                if (reply.attachment) {
                    should(reply.attachment).be.null();
                }

                // The progress should not have been created.
                chat.progress.should.not.have.property('nuggets');

                done();
            });
        });


        it('should overwrite an existing progress', function(done) {
            var arguments = {
                name: 'nuggets',
                value: 32,
                target: 200
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: {
                            current: 32,
                            target: 100
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/32/g);
                reply.body.should.match(/200/g);
                reply.body.should.match(/16%/g);
                reply.body.should.match(/▕█▌▏▏▏▏▏▏▏▏▏/g);

                // The progress should now have the same value but a new target.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(32);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(200);

                done();
            });
        });
    });


    describe('set', function() {
        it('should update the value of an existing progress', function(done) {
            var arguments = {
                'name': 'nuggets',
                'value': 88
            };

            var info = {
                chatData: {
                    progress: {
                        'nuggets': {
                            'current': 62,
                            'target': 200
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/88/g);
                reply.body.should.match(/200/g);
                reply.body.should.match(/44%/g);
                reply.body.should.match(/▕████▍▏▏▏▏▏▏/g);

                // The progress should have been updated without affecting
                // the target.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(88);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(200);

                done();
            });
        });
    });


    describe('get', function() {
        it('should show an existing progress', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        'nuggets': {
                            'current': 56,
                            'target': 200
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/56/g);
                reply.body.should.match(/200/g);
                reply.body.should.match(/28%/g);
                reply.body.should.match(/▕██▊▏▏▏▏▏▏▏▏/g);

                // The progress should not have been modified.
                chat.should.have.property('progress');
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.have.property('current');
                chat.progress.nuggets.current.should.eql(56);
                chat.progress.nuggets.should.have.property('target');
                chat.progress.nuggets.target.should.eql(200);

                done();
            });
        });


        it('should round to three decimal places', function(done) {
            var arguments = {
                name: 'nuggets'
            };

            var info = {
                chatData: {
                    progress: {
                        nuggets: {
                            current: 218.168,
                            target: 1000
                        }
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/218\.168/g);
                reply.body.should.match(/1000/g);
                reply.body.should.match(/21\.817%/g);
                reply.body.should.match(/▕██▏▏▏▏▏▏▏▏▏/g);

                done();
            });
        });


        it("should show an error if the progress doesn't exist", function(done) {
            var arguments = {
                'name': 'nuggets'
            };

            command.func(arguments, {}, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/not ((defined)|(exist))/gi);

                done();
            });
        });
    });
});
