// Send a sticker when a message is received that ends with a kiss.

var noKisses = function(matches, info, replyCallback) {
    // Always reply with the same sticker.
    var message = {
        body: '',
        sticker: '396449327165840'
    };

    replyCallback(message);
}


module.exports = function init() {
    return {
    	name: 'noKisses',
        pattern: /^(?!.*OS X$).*\sx$/gi,  // String that ends a space and then a letter x.
        func: noKisses
    }
};
