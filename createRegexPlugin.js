// Run this script to create a template for a new Zuckerbot plugin.
//
// Usage:
//     node createRegexPlugin.js COMMAND_NAME

var fs = require('fs');
var log = require('npmlog')

if (process.argv.length < 3) {
    log.error('createRegexPlugin', 'a plugin name must be supplied');
    process.exit(1);
}

var commandName = process.argv[2];
var filename = './regexCommands/' + commandName + '.js';
var testFilename = './test/regexCommands/' + 'test_' + commandName + '.js';

var pluginContents = fs.readFileSync('./templates/regexPluginTemplate.js', 'utf8');
var testContents = fs.readFileSync('./templates/regexTestTemplate.js', 'utf8');

pluginContents = pluginContents.replace(/COMMAND_NAME/g, commandName);
testContents = testContents.replace(/COMMAND_NAME/g, commandName);

fs.writeFileSync(filename, pluginContents);
fs.writeFileSync(testFilename, testContents);
