
// Assertion library
var should = require('should');

// Import all the initialiser functions from the regex commands.
var initialisers = require('require-all')(__dirname + '/../../regexCommands');

// Exclude commands which have a prerequesite in the init function.
var excluded = [
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

                // Check the pattern property is a regex.
                command.should.have.property('pattern');
                if (!(command.pattern instanceof RegExp)) {
                    var assertion = new should.Assertion(command.pattern);
                    assertion.params = {
                        operator: 'to be a RegExp object'
                    };
                    assertion.fail()
                }

                // Perform a basic sanity check on the pattern string to check
                // that it resembles a valid regular expression.
                try {
                    var regex = new RegExp(command.pattern);
                }
                catch (err) {
                    var assertion = new should.Assertion(command.pattern);
                    assertion.params = {
                        operator: 'to be a valid regex'
                    };
                    assertion.fail()
                }

                // Check the func property is actually a function.
                command.should.have.property('func');
                command.func.should.be.Function();
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
