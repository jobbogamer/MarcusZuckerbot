// Helper functions used by commands.


// Draw a progress bar using Unicode.
var drawProgressBar = function(percentage) {
    var leftEdge = '▕';
    var rightEdge = '▏';
    var characters = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█'];

    // Marker for left edge.
    var bar = leftEdge;

    // Count how many full blocks are required and add them.
    var fullBlocks = Math.floor(percentage / 10);
    for (var i = 0; i < fullBlocks; i++) {
        bar += characters[8];
    }

    // Add the partial segment at the end. The unicode blocks go down to eigths
    // so split the partial block into (10 ÷ 8) pieces, each size 1.25.
    var partial = Math.floor((percentage - (fullBlocks * 10)) / 1.25);
    bar += characters[partial];

    // Add empty spaces where there are no blocks.
    while (bar.length < 11) {
        bar += rightEdge;
    }

    // Add the marker for the right edge.
    bar += rightEdge;

    return bar;
}


module.exports = {
    drawProgressBar: drawProgressBar
};
