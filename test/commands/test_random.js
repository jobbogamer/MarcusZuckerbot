
var init = require('../../commands/random');
var should = require('should');


var chosen = [];


function execute(command, arguments, info, iteration, maxIterations, doneCallback) {
    var choices = [];

    if (arguments.others) {
        choices.push(arguments.choice1);
        choices.push(arguments.choice2);
        choices = choices.concat(arguments.others);
    }
    else {
        choices = [arguments.choice1, arguments.choice2];
    }

    var argumentsCopy = arguments;
    var infoCopy = info;

    command.func(arguments, info, function replyCallback(reply, chat) {
        reply.should.be.Object();
        reply.should.have.property('body');
        reply.body.should.be.String();

        // The reply should come from the list of choices.
        reply.body.should.equalOneOf(choices);

        // Add the choice that was sent to the list.
        chosen.push(reply.body);

        // Execute the command again.
        if (iteration < maxIterations) {
            execute(command, argumentsCopy, infoCopy, iteration + 1, maxIterations, doneCallback);
        }
        else {
            doneCallback();
        }
    });
}


describe('random', function() {
    describe('execute', function() {
        it('should do pick an item from a choice of 5', function(done) {
            var command = init();
            chosen = [];

            var arguments = {
                choice1: 'Alpha',
                choice2: 'Beta',
                others: ['Charlie', 'Delta', 'Echo']
            };

            // Do the test 10 times, because the command uses randomness.
            execute(command, arguments, {}, 1, 10, function doneCallback() {
                // Check that the same choices wasn't sent every time.
                var foundDifferent = false;

                // If any pair of choices differs from one another, that's
                // enough to prove that it wasn't the same choices every time.
                for (var i = 0; i < chosen.length - 1; i++) {
                    if (chosen[i] !== chosen[i+1]) {
                        foundDifferent = true;
                        break;
                    }
                }
                foundDifferent.should.be.true();

                done();
            });
        });


        it('should do pick an item from a choice of 2', function(done) {
            var command = init();
            chosen = [];

            var arguments = {
                choice1: 'Left',
                choice2: 'Right'
            };

            // Do the test 10 times, because the command uses randomness.
            execute(command, arguments, {}, 1, 10, function doneCallback() {
                // Check that the same choice wasn't sent every time.
                var foundDifferent = false;

                // If any pair of choices differs from one another, that's
                // enough to prove that it wasn't the same choices every time.
                for (var i = 0; i < chosen.length - 1; i++) {
                    if (chosen[i] !== chosen[i+1]) {
                        foundDifferent = true;
                        break;
                    }
                }
                foundDifferent.should.be.true();

                done();
            });
        });
    });
});
