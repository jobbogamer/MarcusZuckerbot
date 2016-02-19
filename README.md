# MarcusZuckerbot

MarcusZuckerbot, or Zuckerbot for short, is a chatbot for Facebook Chat, written
in [node.js][node].

The real Facebook Chat API was deprecated in April 2015, so Zuckerbot relies on
[facebook-chat-api][fb-api], an implementation by [Schmavery][Schmavery] which
emulates a browser instead of calling an official API.

[node]: http://nodejs.org
[fb-api]: https://github.com/Schmavery/facebook-chat-api
[Schmavery]: https://github.com/Schmavery

***

## Install

1. Download the [latest release][release] from GitHub and unzip it.
2. Inside the MarcusZuckerbot directory, run `npm install` to install
   dependencies.

[release]: https://github.com/jobbogamer/MarcusZuckerbot/releases/latest

***

## Setup

1. You will need a [Firebase][firebase] account. This is free, and provides a
   hosted key-value store which Zuckerbot stores its data in.
   
   Set a `FIREBASE` environment variable to the URL of your Firebase database.

2. You will also need a Facebook account for the bot. This can be your own,
   existing account, but having a specific account for the bot is recommended.
   
   Set `FB_EMAIL` and `FB_PASSWORD` environment variables for the email address
   and password of the bot's account.

[firebase]: http://firebase.com

***
 
## Run

```
npm start
```

***

## Use

### Commands

Zuckerbot responds to commands which look a bit like function calls in any
normal programming language. To see a list of available commands, run:

```
zb.help()
```

All commands listed can be called using `zb.commandName()`.

### Arguments

Some commands take arguments between the parentheses (including `help()`). These
arguments can be strings, numbers, or booleans.

- Strings must be between single quotes.
- Numbers do not require quotes.
- Booleans do not require quotes, and are either `true` or `false`, lowercase.

To see what arguments a command takes, pass its name to `help()`:

```
zb.help('commandName')
```

### `/send` Endpoint

Starting with v1.0.3, Zuckerbot can send arbitrary messages to any conversation
by sending a POST request to the `/send` endpoint. The request should use
`application/json` encoding, and must contain the following body:

```
{
    "thread_ids": ["123456", "16854912"],
    "body": "This is a message"
}
```

where `thread_ids` is an array of Facebook thread IDs as strings, and `body` is
the body of the message to be sent.

Any valid request sent to `/send` will be acted upon immediately. The request
will return no response.

***

## Deploy

Zuckerbot can be deployed anywhere which supports node.js and `npm`. Simply set
the environment variables, as described above, and get the server to run `npm
start`.

For example, Zuckerbot's `.travis.yml` file defines a deployment to
[Openshift][openshift] using its [node.js cartridge][cartridge]. If you want to
deploy to your own Openshift account, **make sure to change the account settings
in the `.travis.yml` file.**

[openshift]: http://openshift.redhat.com
[cartridge]: https://hub.openshift.com/quickstarts/99-node-js-0-10

***

## Develop

Zuckerbot uses a plugin system for its commands, to make it easy to develop new
commands for your own bot.

Each command is defined in a separate file, in the `commands` directory. The
name of the file should match the name of the command.

When Zuckerbot starts, it tries to load each file in the `commands` directory
and import an initialisation function from it. It uses the return value of that
function to load the command and make it available to users.

You can get started developing a new plugin by running:

```
node createPlugin.js commandName
```

This will create a command file and a test suite file for your plugin. The
default implementation from the template replies 'Hello, world!' whenever the
plugin is called, and the default test suite defines a test which always fails,
to remind you to implement some tests.

### Exports

Your command file can contain as many functions as you like, and can `require`
other modules if necessary.

The file should export a single function, conventionally called `init()`, which
takes no arguments and returns an object. This object should have three
properties, described below.

The initialiser test generated in `test_initialisers.js` for each command will
test that your exported function returns an object with the expected format.

#### `name`

The `name` property should be a string containing the name of the command, as it
will appear when listed by the `help()` command.

#### `func`

The `func` property is the function which is called when the command is
executed. By convention, it should have the same name as the command itself.
It should take three arguments:

```
var commandName = function(arguments, info, replyCallback) {
    ...
}
```

- `arguments` will contain the arguments passed in to the command by the user.
  Each argument will be indexed by its name as defined in `usage`.
  
  For example, when `setValue()` is called using `zb.setValue('a', 7)`, the
  arguments will be:
  
  ```
  {
      variable: 'a',
      value: 7
  }
  ```

- `info` contains various pieces of information about the current conversation
  and other information available to Zuckerbot. This object contains:
  - `threadID` - The Facebook conversation ID for the current conversation.
  - `sender` - The full name of the Facebook user who invoked the command.
  - `attachments` - Any attachments which were sent with the command
    invocation, such as images.
  - `chatData` - Contains data from the database related to the current
    conversation.
  - `facebookAPI` - A copy of the facebook-chat-api object, so your command
    can perform actions on the conversation.

- `replyCallback` is a callback function which should be called when your
  command finishes executing. It takes two arguments:
    - `reply` - a message object [as defined by facebook-chat-api][object] which
      will be sent as a reply in the conversation the command came from.
    - `chat` - pass this back the `info.chatData` object which was passed in,
      with any changes your command made. This is required to save changes in
      the database.

[handle]: https://github.com/jobbogamer/MarcusZuckerbot/blob/master/messageHandler.js
[object]: https://github.com/Schmavery/facebook-chat-api/blob/master/DOCS.md#sendMessage

#### `usage`

The `usage` property should be an array of objects which define the usage
patterns for your command.

Each element of the array is one possible usage of your command. For example, if
your command can be called with either one or two arguments, the array should
have two elements.

Each element should be an object with two properties, `arguments` and
`description`:
- `arguments` is an array describing the arguments the command takes, and the
  name of each argument. These names are used as the keys in the `arguments`
  parameter passed into `func`, and are also displayed when calling
  `help('yourCommand')`.
- `description` is a string describing the effect of the command when executed
  with the arguments described.

An example `usage` array is as follows:

```
[
    {
        arguments: ['x', 'y'],
        description: 'Displays the value of x + y.'
    },
    {
        arguments: ['x', 'y', 'z'],
        descrition: 'Displays the value of x + y + z.'
    }
]
```

Starting with v1.1.0, commands can have an arbitrary number of arguments.
Specify all required arguments first, then end the list with `'...'`. The
message handler will check that the required arguments are present, and allow
any number of optional arguments (including zero).

An example command using optional arguments would be as shown below. In this
example, the command requires at least two arguments, but can have any number
greater than or equal to two.

```
[
    {
        arguments: ['num1', 'num2', '...'],
        description: 'Sum all the given numbers'
    }
]
```

When using arguments in this way, the optional arguments cannot be given a name
when being passed to your command function. All optional arguments will be
passed in a single array, `arguments.others`.

### Failing initialisation

If your command has a prerequisite, such as requiring an environment variable to
be set, you can check this in your `init()` function, and return a different
object if initialisation fails.

This object should have a single property, `error`, which is a string describing
the error.

If your `init()` function returns an error, the command will not be loaded and
will not be available to users.

An example `init()` function is below:

```
var add = func(arguments, info, replyCallback) {
    ...
}

var usage = [
    ...
]

module.exports = function init() {
    if (!process.env.SOME_VAR) {
        return {
            error: 'SOME_VAR is not set.'
        }
    }

    else {
        return {
            name: 'add',
            func: add,
            usage: usage
        }
    }
}
```

### Regular Expression commands

v1.1.0 of Zuckerbot introduced a new type of plugin, the regex command. These
commands act similarly to regular commands, but instead of being invoked using
the `zb.` syntax, they are triggered whenever a message is received which
matches a certain regular expression.

Regex commands are stored in the `regexCommands` directory instead of the usual
`commands` directory.

The object returned from `init()` is slightly different for regex commands;
instead of `usage`, a new property called `pattern` should be returned. This
property should contain the regular expression object to match messages
against.

An example object is shown below:

```
{
    name: 'helloWorld',
    func: helloWorld,
    pattern: /hello,? world!/gi
}
```

The usual semantics apply – the `pattern` should be a valid RegExp object.

When the command is executed, it will be passed an array called `matches`
instead of `arguments`. This is an array of every string in the message that
matches `pattern`.

To create a new regex command, run

```
node createRegexPlugin commandName
```


***

## Test

There are unit tests defined for all Zuckerbot commands, using [mocha.js][mocha]
and [should.js][should]. The tests are defined in the `test` directory, and can
be run using:

```
npm test
```

Each command has its own unit test file. There is also a special file,
`test_initialisers.js`, which automatically defines a unit test for every
command, to test that its initialiser returns a valid object.

To stop an initialiser test from being defined from a command, add it to the
`excluded` list in `test_initialisers.js`. This is only necessary if the
initialiser for a command can fail, such as the `sendGIF()` command which checks
an environment variable.

If you disable the automatic test, it is recommended that you define your own
test. See `test_sendGIF.js` for an example.

There is a separate directory for regex command tests. There is a second
initialiser test file, `test_regexInitialisers.js`, in that directory, which
acts in the same way.

[mocha]: http://mochajs.org
[should]: https://github.com/shouldjs/should.js

