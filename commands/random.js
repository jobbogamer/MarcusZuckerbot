// Pick a random item from a list.

var helpers = require('../helpers');


var random = function(arguments, info, replyCallback) {
    // If only two choices were given, set others to an empty array.
    arguments.others = arguments.others || [];

    // Create an array containing all the choices.
    var choices = [];
    choices.push(arguments.choice1);
    choices.push(arguments.choice2);
    choices = choices.concat(arguments.others);

    // Pick a random number between 0 and (choices.length - 1), and use that
    // as the index of the chosen item.
    var index = helpers.randBetween(0, choices.length);

    var message = {
        body: choices[index]
    };

    replyCallback(message);
}

var usage = [
    {
        arguments: ['choice1', 'choice2', '...'],
        description: 'Pick a random item from the given list.'
    }
];


module.exports = function init() {
    return {
        name: 'random',
        func: random,
        usage: usage
    }
};
