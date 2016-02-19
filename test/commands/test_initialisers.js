
// Assertion library
var should = require('should');

// Import all the initialiser functions from the commands.
var initialisers = require('require-all')(__dirname + '/../../commands');

// Exclude commands which have a prerequesite in the init function.
var excluded = [
    'sendGIF',
    'suggestCommand',
    'suggestFeature'
];


// Test suite definition function which will be called for each command. It
// checks that the module exports a function, and when that function is called,
// a valid command object is returned which contains the correct properties.
var suite = function(name, initialiser) {
    describe(key, function() {
        describe('init', function() {
            it('should return a valid command object', function() {
                // Call the initialiser to return a command object.
                initialiser.should.be.Function();
                var command = initialiser();

                // Check the name property is a non-empty string.
                command.should.have.property('name');
                command.name.should.be.String();
                command.name.should.not.be.length(0);

                // Check the func property is actually a function.
                command.should.have.property('func');
                command.func.should.be.Function();

                // Check the usage property is an array.
                command.should.have.property('usage');
                command.usage.should.be.Array();

                // Check each element of the usage array to make sure each one
                // is an object containing an array of arguments and a string
                // description.
                for (var i = 0; i < command.usage.length; i++) {
                    var usage = command.usage[i];
                    usage.should.be.Object();

                    // Check the usage has an array of arguments.
                    usage.should.have.property('arguments');
                    usage.arguments.should.be.Array();

                    // Check that each element of the arguments array is a
                    // non-empty string.
                    for (var j = 0; j < command.usage[i].arguments.length; j++) {
                        var argument = usage.arguments[j];
                        argument.should.be.String();
                        argument.should.not.be.length(0);
                    }

                    // Check the description is a non-empty string.
                    usage.should.have.property('description');
                    command.usage[i].description.should.be.String();
                    command.usage[i].description.should.not.be.length(0);
                }
            });
        });
    });
}

for (var key in initialisers) {
    // Only create the test if the test isn't excluded.
    if (excluded.indexOf(key) === -1) {
        // Test suite definition must be wrapped in a function in order for the
        // key and initialiser to be in scope in the test suite.
        (function defineTest(defineSuite) {
            var initialiser = initialisers[key];
            defineSuite(key, initialiser);
        })(suite);
    }
}
