
var init = require('../commands/sendGIF');


describe('sendGIF', function() {
    describe('init', function() {
        it('should return an error if no API key is set', function() {
            init.should.be.Function();

            // Make sure the GIPHY_API_KEY variable is not set.
            if (process.env.GIPHY_API_KEY) {
                delete process.env.GIPHY_API_KEY;
            }

            var result = init();

            result.should.be.Object();
            result.should.have.property('error');
            result.error.should.be.String();
            result.error.should.not.have.length(0);
        });

        it('should return a valid command object when an API key is set', function() {
            init.should.be.Function();

            // Set any string as the 'API key'. It doesn't matter what is used.
            process.env.GIPHY_API_KEY = 'abcdef123';

            var command = init();

            // Check the name property is a non-empty string.
            command.should.have.property('name');
            command.name.should.be.String();
            command.name.should.not.be.length(0);
            command.name.should.be.eql('sendGIF');

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
