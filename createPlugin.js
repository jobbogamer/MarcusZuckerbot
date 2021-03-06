// Run this script to create a template for a new Zuckerbot plugin.
//
// Usage:
//     node createPlugin.js COMMAND_NAME

var fs = require('fs');
var log = require('npmlog')

if (process.argv.length < 3) {
    log.error('createPlugin', 'a plugin name must be supplied');
    process.exit(1);
}

var commandName = process.argv[2];
var filename = './commands/' + commandName + '.js';
var testFilename = './test/commands/' + 'test_' + commandName + '.js';

var pluginContents = fs.readFileSync('./templates/pluginTemplate.js', 'utf8');
var testContents = fs.readFileSync('./templates/testTemplate.js', 'utf8');

pluginContents = pluginContents.replace(/COMMAND_NAME/g, commandName);
testContents = testContents.replace(/COMMAND_NAME/g, commandName);

fs.writeFileSync(filename, pluginContents);
fs.writeFileSync(testFilename, testContents);
