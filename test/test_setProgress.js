
var init = require('../commands/setProgress');
var command = init();


describe('setProgress', function() {
    describe('execute', function() {
        it('should set the progress of new variables', function(done) {
            var arguments = {
                name: 'nuggets',
                percentage: 45.6
            };

            var info = {
                chatData: {
                    progress: {
                        sausage: 23.4
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain the name of the variable and the
                // value. The display of the actual progress bar is tested
                // in test_showProgress.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/45\.6/g);

                // The progress should have been saved.
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.eql(45.6);

                // The existing variable should not have been edited.
                chat.progress.should.have.property('sausage');
                chat.progress.sausage.should.eql(23.4);

                done();
            });
        });


        it('should calculate the percentage when 3 arguments are given', function(done) {
            var arguments = {
                name: 'nuggets',
                x: 17,
                y: 68
            };

            var info = {
                chatData: {
                    progress: {
                        sausage: 23.4
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain the name of the variable and the
                // value. The display of the actual progress bar is tested
                // in test_showProgress.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/25/g);

                // The progress should have been saved.
                chat.progress.should.have.property('nuggets');
                chat.progress.nuggets.should.eql(25);

                // The existing variable should not have been edited.
                chat.progress.should.have.property('sausage');
                chat.progress.sausage.should.eql(23.4);

                done();
            });
        });


        it('should not allow negative numbers', function(done) {
            var arguments = {
                name: 'nuggets',
                percentage: -10
            };

            var info = {
                chatData: {
                    progress: {
                        sausage: 23.4
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain the name of the variable and the
                // value. The display of the actual progress bar is tested
                // in test_showProgress.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(not be negative)|(non-negative)|(greater than or equal to (0|zero))/gi);

                // The progress should not have been saved.
                chat.progress.should.not.have.property('nuggets');

                // The existing variable should not have been edited.
                chat.progress.should.have.property('sausage');
                chat.progress.sausage.should.eql(23.4);

                done();
            });
        });


        it('should not allow numbers greater than 100', function(done) {
            var arguments = {
                name: 'nuggets',
                percentage: 108.2
            };

            var info = {
                chatData: {
                    progress: {
                        sausage: 23.4
                    }
                }
            };

            command.func(arguments, info, function replyCallback(reply, chat) {
                // The reply should contain the name of the variable and the
                // value. The display of the actual progress bar is tested
                // in test_showProgress.
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();
                reply.body.should.match(/(less|smaller|lower) than or equal to 100/gi);

                // The progress should not have been saved.
                chat.progress.should.not.have.property('nuggets');

                // The existing variable should not have been edited.
                chat.progress.should.have.property('sausage');
                chat.progress.sausage.should.eql(23.4);

                done();
            });
        });
    });
});
