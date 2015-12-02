// Main component of Zuckerbot. The server is the 'brains' behind the whole
// thing – this component performs the connection to Facebook and collects
// messages before sending them off to be matched and acted on.

var http = require('http')


// Pick the port based on what Azure says should be used.
var port = process.env.PORT || 1337;

console.log('Starting server on port ' + port);

// Hello, world!
http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
    
    console.log('Received request');

}).listen(port);
