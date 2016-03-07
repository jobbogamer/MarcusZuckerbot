
var init = require('../../regexCommands/operators');
var should = require('should');


describe('operators', function() {
    describe('match', function() {
        // Test that the regex only matches expected messages.
        var command = init();
        var regex = new RegExp(command.pattern);


        it('should match increment', function() {
            var string = 'zb.nuggets++';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            match[2].should.eql('++');
            if (match[3]) {
                match[3].should.have.length(0);
            }
            if (match[4]) {
                match[4].should.have.length(0);
            }
        });


        it('should match decrement', function() {
            var string = 'zb.nuggets--';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            match[2].should.eql('--');
            if (match[3]) {
                match[3].should.have.length(0);
            }
            if (match[4]) {
                match[4].should.have.length(0);
            }
        });


        it('should match addition', function() {
            var string = 'zb.nuggets += 5';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            if (match[2]) {
                match[2].should.have.length(0);
            }
            match[3].should.eql('+=');
            match[4].should.eql('5');
        });


        it('should match subtraction', function() {
            var string = 'zb.nuggets -= 10';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            if (match[2]) {
                match[2].should.have.length(0);
            }
            match[3].should.eql('-=');
            match[4].should.eql('10');
        });


        it('should match assignment', function() {
            var string = 'zb.nuggets = 8';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            if (match[2]) {
                match[2].should.have.length(0);
            }
            match[3].should.eql('=');
            match[4].should.eql('8');
        });


        it('should match assignment with negative numbers', function() {
            var string = 'zb.nuggets = -3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(1);

            // Check that the match has the correct captured groups.
            var match = matches[0];
            match.should.have.length(5);
            match[1].should.eql('nuggets');
            if (match[2]) {
                match[2].should.have.length(0);
            }
            match[3].should.eql('=');
            match[4].should.eql('-3');
        });


        it('should not match addition with no spaces', function() {
            var string = 'zb.nuggets+=3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });


        it('should not match subtraction with no spaces', function() {
            var string = 'zb.nuggets-=3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });


        it('should not match assignment with no spaces', function() {
            var string = 'zb.nuggets=3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });


        it('should not match when zb is not present', function() {
            var string = 'nuggets += 3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });


        it('should not match invalid variable names', function() {
            var strings = ['zb.123abc += 3', 'zb.-turkey -= 5', 'zb.hi! = 10'];
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            strings.forEach(function (string) {
                while (currentMatches = regex.exec(string)) {
                    matches.push(currentMatches);
                }
            });

            matches.should.have.length(0);
        });


        it('should not match when zb is not present', function() {
            var string = 'nuggets += 3';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });


        it('should not match when the second operand is not a number', function() {
            var string = 'zb.nuggets += donuts';
            var matches = [];
            var currentMatches = [];

            // Try to repeatedly match the regex, putting each array of captured
            // groups into the matches array.
            while (currentMatches = regex.exec(string)) {
                matches.push(currentMatches);
            }

            matches.should.have.length(0);
        });
    });


    describe('execute', function() {
        it('should increment a variable', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets++', 'nuggets', '++', null, null]
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/9/gi);

                // The variable should have been incremented.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(9);

                done();
            });
        });


        it('should decrement a variable', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets--', 'nuggets', '--', null, null]
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/7/gi);

                // The variable should have been incremented.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(7);

                done();
            });
        });


        it('should add to a variable', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets += 5', 'nuggets', null, '+=', '5']
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/13/gi);

                // The variable should have been incremented.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(13);

                done();
            });
        });


        it('should subtract from a variable', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets -= 5', 'nuggets', null, '-=', '5']
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/3/gi);

                // The variable should have been incremented.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(3);

                done();
            });
        });


        it('should set a variable', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets = 11', 'nuggets', null, '=', '11']
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of the variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/11/gi);

                // The variable should have been incremented.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(11);

                done();
            });
        });


        it('should match multiple operators', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets++',     'nuggets',  '++', null, null],
                ['zb.sausages += 3', 'sausages', null, '+=', '3']
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8,
                        sausages: 4
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of each variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/9/gi);
                reply.body.should.match(/sausages/gi);
                reply.body.should.match(/7/gi);

                // The variables should have been changed.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(9);
                chat.variables.should.have.property('sausages');
                chat.variables.sausages.should.eql(7);

                done();
            });
        });


        it('should cope when a variable does not exist', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets += 5', 'nuggets', null, '+=', '5']
            ];

            var info = {
                chatData: {
                    variables: {
                        sausages: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state that the variable doesn't exist.
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // The sausages variable should stay the same.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('sausages');
                chat.variables.sausages.should.eql(8);

                done();
            });
        });


        it('should match multiple operators when one variable does not exist', function(done) {
            var command = init();

            var matches = [
                ['zb.nuggets++',     'nuggets', '++',  null, null],
                ['zb.sausages += 3', 'sausages', null, '+=', '3']
            ];

            var info = {
                chatData: {
                    variables: {
                        nuggets: 8
                    }
                }
            };

            command.func(matches, info, function replyCallback(reply, chat) {
                reply.should.be.Object();
                reply.should.have.property('body');
                reply.body.should.be.String();

                // The reply should state the new value of each variable.
                reply.body.should.match(/nuggets/gi);
                reply.body.should.match(/9/gi);
                reply.body.should.match(/sausages/gi);
                reply.body.should.match(/(not defined)|(not exist)/gi);

                // The nuggets variable should have been changed.
                chat.should.be.Object();
                chat.should.have.property('variables');
                chat.variables.should.have.property('nuggets');
                chat.variables.nuggets.should.eql(9);

                done();
            });
        });
    });
});
